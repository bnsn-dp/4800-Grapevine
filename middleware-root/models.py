# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Chatroom(models.Model):
    crid = models.CharField(db_column='CRID', primary_key=True, max_length=16)  # Field name made lowercase.
    user1 = models.ForeignKey('Users', models.DO_NOTHING, db_column='User1')  # Field name made lowercase.
    user2 = models.ForeignKey('Users', models.DO_NOTHING, db_column='User2', related_name='chatroom_user2_set')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ChatRoom'


class Comments(models.Model):
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserID', primary_key=True)  # Field name made lowercase. The composite primary key (UserID, PostID, CommentID) found, that is not supported. The first column is selected.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    usercomment = models.CharField(db_column='UserComment', max_length=250)  # Field name made lowercase.
    commentdate = models.DateField(db_column='CommentDate')  # Field name made lowercase.
    commentid = models.CharField(db_column='CommentID', max_length=16)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Comments'
        unique_together = (('userid', 'postid', 'commentid'),)


class Communities(models.Model):
    communityid = models.CharField(db_column='CommunityID', primary_key=True, max_length=16)  # Field name made lowercase.
    communityname = models.CharField(db_column='CommunityName', max_length=40)  # Field name made lowercase.
    communitydescription = models.CharField(db_column='CommunityDescription', max_length=250, blank=True, null=True)  # Field name made lowercase.
    creationdate = models.DateField(db_column='CreationDate')  # Field name made lowercase.
    ownerid = models.ForeignKey('Users', models.DO_NOTHING, db_column='OwnerID')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Communities'


class Communitypost(models.Model):
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase.
    communityid = models.ForeignKey(Communities, models.DO_NOTHING, db_column='CommunityID')  # Field name made lowercase.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    cpid = models.CharField(db_column='CPID', max_length=16)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CommunityPost'


class Createdposts(models.Model):
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserID', primary_key=True)  # Field name made lowercase. The composite primary key (UserID, PostID, UCPID) found, that is not supported. The first column is selected.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    ucpid = models.CharField(db_column='UCPID', max_length=16)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CreatedPosts'
        unique_together = (('userid', 'postid', 'ucpid'),)


class Engagement(models.Model):
    engageid = models.CharField(db_column='EngageID', primary_key=True, max_length=16)  # Field name made lowercase. The composite primary key (EngageID, PostID, UserID) found, that is not supported. The first column is selected.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase.
    engagementtype = models.CharField(db_column='EngagementType', max_length=8)  # Field name made lowercase.
    engagedate = models.DateField(db_column='EngageDate')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Engagement'
        unique_together = (('engageid', 'postid', 'userid'),)


class Members(models.Model):
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserID', primary_key=True)  # Field name made lowercase. The composite primary key (UserID, CommunityID, MemberID) found, that is not supported. The first column is selected.
    communityid = models.ForeignKey(Communities, models.DO_NOTHING, db_column='CommunityID')  # Field name made lowercase.
    joindate = models.DateField(db_column='JoinDate')  # Field name made lowercase.
    memberid = models.CharField(db_column='MemberID', max_length=16)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Members'
        unique_together = (('userid', 'communityid', 'memberid'),)


class Message(models.Model):
    mid = models.CharField(db_column='MID', primary_key=True, max_length=16)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=512)  # Field name made lowercase.
    sent = models.DateTimeField(db_column='Sent')  # Field name made lowercase.
    sender = models.ForeignKey('Users', models.DO_NOTHING, db_column='Sender')  # Field name made lowercase.
    crid = models.ForeignKey(Chatroom, models.DO_NOTHING, db_column='CRID')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Message'


class Posts(models.Model):
    postid = models.CharField(db_column='PostID', primary_key=True, max_length=16)  # Field name made lowercase.
    postdescription = models.CharField(db_column='PostDescription', max_length=250, blank=True, null=True)  # Field name made lowercase.
    imagelink = models.CharField(db_column='ImageLink', max_length=250)  # Field name made lowercase.
    posttime = models.DateTimeField(db_column='PostTime')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Posts'


class Settings(models.Model):
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserID', primary_key=True)  # Field name made lowercase. The composite primary key (UserID, SetID) found, that is not supported. The first column is selected.
    setid = models.CharField(db_column='SetID', max_length=16)  # Field name made lowercase.
    private = models.IntegerField(db_column='Private', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Settings'
        unique_together = (('userid', 'setid'),)


class Sharedposts(models.Model):
    sharerid = models.OneToOneField('Users', models.DO_NOTHING, db_column='SharerID', primary_key=True)  # Field name made lowercase. The composite primary key (SharerID, OwnerID, PostID, SPID) found, that is not supported. The first column is selected.
    ownerid = models.ForeignKey('Users', models.DO_NOTHING, db_column='OwnerID', related_name='sharedposts_ownerid_set')  # Field name made lowercase.
    postid = models.ForeignKey(Posts, models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    sharedate = models.DateField(db_column='ShareDate')  # Field name made lowercase.
    spid = models.CharField(db_column='SPID', max_length=16)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SharedPosts'
        unique_together = (('sharerid', 'ownerid', 'postid', 'spid'),)


class Users(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=16)  # Field name made lowercase.
    username = models.CharField(db_column='Username', max_length=40)  # Field name made lowercase.
    userpassword = models.CharField(db_column='UserPassword', max_length=40)  # Field name made lowercase.
    joindate = models.DateField(db_column='JoinDate')  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=9)  # Field name made lowercase.
    bio = models.CharField(db_column='Bio', max_length=120, blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=120)  # Field name made lowercase.
    firstname = models.CharField(db_column='FirstName', max_length=45)  # Field name made lowercase.
    lastname = models.CharField(db_column='LastName', max_length=45)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Users'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DemoappDbinfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=120)
    favnum = models.IntegerField(db_column='favNum')  # Field name made lowercase.
    dislikes = models.TextField()

    class Meta:
        managed = False
        db_table = 'demoapp_dbinfo'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
