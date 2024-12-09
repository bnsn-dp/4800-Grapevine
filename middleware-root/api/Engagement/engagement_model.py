from django.db import models

class Engagement(models.Model):
    engageid = models.CharField(db_column='EngageID', primary_key=True, max_length=16)  # Field name made lowercase. The composite primary key (EngageID, PostID, UserID) found, that is not supported. The first column is selected.
    postid =models.CharField(db_column='PostID',max_length=16)
    userid = models.CharField(db_column='UserID',max_length=16)
    engagementtype = models.CharField(db_column='EngagementType', max_length=8)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Engagement'