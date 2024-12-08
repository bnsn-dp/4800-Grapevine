from django.db import models

class Communities(models.Model):
    communityid = models.CharField(db_column='CommunityID', primary_key=True, max_length=16)  # Field name made lowercase.
    communityname = models.CharField(db_column='CommunityName', max_length=40)  # Field name made lowercase.
    communitydescription = models.CharField(db_column='CommunityDescription', max_length=250, blank=True, null=True)  # Field name made lowercase.
    creationdate = models.DateField(db_column='CreationDate', auto_now_add=True)  # Field name made lowercase.
    ownerid = models.CharField(max_length=16, db_column='OwnerID')  # Field name made lowercase.
    communitykey = models.CharField(max_length=32, db_column='CommunityKey')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Communities'