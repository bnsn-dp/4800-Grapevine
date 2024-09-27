from django.db import models

# Create your models here.
class Comments(models.Model):
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, PostID, CommentID) found, that is not supported. The first column is selected.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    usercomment = models.CharField(db_column='UserComment', max_length=250)  # Field name made lowercase.
    commentdate = models.DateField(db_column='CommentDate')  # Field name made lowercase.
    commentid = models.CharField(db_column='CommentID', max_length=16, primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Comments'

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
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, CommunityID, PostID, CPID) found, that is not supported. The first column is selected.
    communityid = models.ForeignKey('Communities', models.DO_NOTHING, db_column='CommunityID', to_field='communityid', related_name='communitypost_communityid_set')  # Field name made lowercase.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    cpid = models.CharField(db_column='CPID', max_length=16, primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CommunityPost'
        unique_together = (('userid', 'communityid', 'postid', 'cpid'),)


class Createdposts(models.Model):
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, PostID, UCPID) found, that is not supported. The first column is selected.
    postid = models.ForeignKey('Posts', models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    ucpid = models.CharField(db_column='UCPID', max_length=16, primary_key=True)  # Field name made lowercase.

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
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, CommunityID, MemberID) found, that is not supported. The first column is selected.
    communityid = models.ForeignKey('Communities', models.DO_NOTHING, db_column='CommunityID')  # Field name made lowercase.
    joindate = models.DateField(db_column='JoinDate')  # Field name made lowercase.
    memberid = models.CharField(db_column='MemberID', max_length=16, primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Members'
        unique_together = (('userid', 'communityid', 'memberid'),)


class Posts(models.Model):
    postid = models.CharField(db_column='PostID', primary_key=True, max_length=16)  # Field name made lowercase.
    postdescription = models.CharField(db_column='PostDescription', max_length=250, blank=True, null=True)  # Field name made lowercase.
    imagelink = models.CharField(db_column='ImageLink', max_length=250)  # Field name made lowercase.
    posttime = models.DateTimeField(db_column='PostTime')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Posts'


class Settings(models.Model):
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, SetID) found, that is not supported. The first column is selected.
    setid = models.CharField(db_column='SetID', max_length=16, primary_key=True)  # Field name made lowercase.
    private = models.IntegerField(db_column='Private', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Settings'
        unique_together = (('userid', 'setid'),)


class Sharedposts(models.Model):
    sharerid = models.ForeignKey('Users', models.DO_NOTHING, db_column='SharerID')  # Field name made lowercase. The composite primary key (SharerID, OwnerID, PostID, SPID) found, that is not supported. The first column is selected.
    ownerid = models.ForeignKey('Users', models.DO_NOTHING, db_column='OwnerID', related_name='sharedposts_ownerid_set')  # Field name made lowercase.
    postid = models.ForeignKey(Posts, models.DO_NOTHING, db_column='PostID')  # Field name made lowercase.
    sharedate = models.DateField(db_column='ShareDate')  # Field name made lowercase.
    spid = models.CharField(db_column='SPID', max_length=16, primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SharedPosts'
        unique_together = (('sharerid', 'ownerid', 'postid', 'spid'),)


class Users(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=16)  # Field name made lowercase.
    username = models.CharField(db_column='Username', max_length=40)  # Field name made lowercase.
    userpassword = models.CharField(db_column='UserPassword', max_length=40)  # Field name made lowercase.
    joindate = models.DateField(db_column='JoinDate', auto_now_add=True)  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=9)  # Field name made lowercase.
    bio = models.CharField(db_column='Bio', max_length=120, blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=120)  # Field name made lowercase.
    firstname = models.CharField(db_column='FirstName', max_length=45)  # Field name made lowercase.
    lastname = models.CharField(db_column='LastName', max_length=45)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Users'

    def __str__(self):
        return self.id
