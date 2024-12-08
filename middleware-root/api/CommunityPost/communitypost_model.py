from django.db import models

class CommunityPost(models.Model):
    userid = models.CharField(max_length=16, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, CommunityID, PostID, CPID) found, that is not supported. The first column is selected.
    communityid = models.CharField(max_length=16, db_column='CommunityID')  # Field name made lowercase.
    postid = models.CharField(max_length=16, db_column='PostID')  # Field name made lowercase.
    cpid = models.CharField(db_column='CPID', max_length=16, primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CommunityPost'
