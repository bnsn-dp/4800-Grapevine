from django.http import HttpResponse, JsonResponse
from .user_model import Users
from django.db import connection
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Createdposts, Posts, Friends

def getUserID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Users')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"U{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        # Check if Content-Type is application/json
        if request.headers.get('Content-Type') != 'application/json':
            return JsonResponse({'message': 'Bad request: Expected JSON'}, status=400)

        # Parse the incoming request body
        try:
            body = json.loads(request.body)
            username = body.get('username')
            password = body.get('userpassword')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

        # Step 1: Check if user exists and is active
        try:
            user = Users.objects.get(username=username)
            print(f"User found: {user.username}")

        except Users.DoesNotExist:
            print("User does not exist")
            return JsonResponse({'message': 'User does not exist Invalid username or password', 'status': 'error'},
                                status=401)
        #
        # # Step 2: Check if password is correct using check_password()
        # if user.check_password(password):
        #     print("Password is correct")
        #     # Optionally, you can return success here if check_password works, bypassing authenticate()
        #     return JsonResponse({'message': 'Login successful', 'status': 'success'})
        # else:
        #     print("Password is incorrect")
        #     return JsonResponse({'message': 'Password is incorrect Invalid username or password', 'status': 'error'}, status=401)

        # Step 3: If using authenticate (this will also re-check the password)
        if user.username == username and user.userpassword == password:
            if user is not None:
                return JsonResponse({'message': 'Login successful', 'status': 'success', 'first_name': user.firstname,
                                     'last_name': user.lastname, 'username': user.username})
            else:
                return JsonResponse({'message': 'Invalid username or password', 'status': 'error'}, status=401)

    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)


@csrf_exempt
def get_user_posts(request):
    if request.method == 'POST':
        logs = []  # Initialize a list to store logs
        try:
            data = json.loads(request.body)
            user_id = data.get('userid')
            post_type = data.get('type')  # Default to 'user' if type is not provided

            # Log the user ID and post type being used for querying
            log_message = f"Received user_id: {user_id}, post type: {post_type}"
            logs.append(log_message)

            # Step 1: Fetch all entries in CreatedPosts that match the given user_id (user's posts)
            created_posts = Createdposts.objects.filter(userid=user_id)
            log_message = f"Found Created_posts entries: {created_posts}"
            logs.append(log_message)

            # If post_type is 'all', retrieve friends' posts as well
            if post_type == 'all':
                # Step 2: Fetch the user's friends (where user is either the friender or the friendee)
                friends = Friends.objects.filter(friender=user_id) | Friends.objects.filter(friendee=user_id)
                log_message = f"Found Friends entries: {friends}"
                logs.append(log_message)

                # Step 3: Collect all friend user IDs
                friend_user_ids = set()  # Using a set to avoid duplicates
                for friend in friends:
                    if friend.friender == user_id:
                        friend_user_ids.add(friend.friendee)  # Add friendee if the user is the friender
                    else:
                        friend_user_ids.add(friend.friender)  # Add friender if the user is the friendee

                # Step 4: Fetch all posts from the user's friends and add them to created_posts
                for friend_id in friend_user_ids:
                    friends_posts = Createdposts.objects.filter(userid=friend_id)
                    created_posts = created_posts.union(friends_posts)

            # Initialize an empty list to hold post details
            posts_data = []

            # Loop through each post and fetch the corresponding post details
            for created_post in created_posts:
                try:
                    # Fetch the post corresponding to the postid in Createdposts
                    post = Posts.objects.get(postid=created_post.postid)
                    log_message = f"Found post: {post}"
                    logs.append(log_message)

                    posts_data.append({
                        'username': created_post.userid.username,  # Get the username of the user
                        'imagelink': post.imagelink,
                        'description': post.postdescription,
                        'datetime': post.posttime,  # Assuming you have a datetime field in Posts
                    })

                except Posts.DoesNotExist:
                    log_message = f"Post with postid {created_post.postid} does not exist."
                    logs.append(log_message)
                    continue  # Skip if the post does not exist

            # Sort the posts by datetime in descending order (newest first)
            sorted_posts = sorted(posts_data, key=lambda x: x['datetime'], reverse=True)

            # Log the sorted posts
            log_message = f"Sorted posts: {sorted_posts}"
            logs.append(log_message)

            return JsonResponse({'posts': sorted_posts, 'logs': logs}, safe=False)

        except Exception as e:
            log_message = f"Error: {str(e)}"
            logs.append(log_message)
            return JsonResponse({'error': str(e), 'logs': logs}, status=400)
