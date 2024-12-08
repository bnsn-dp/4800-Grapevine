from django.db import models

class Members(models.Model):
    userid = models.CharField(max_length=16, db_column='UserID')  # Field name made lowercase. The composite primary key (UserID, CommunityID, MemberID) found, that is not supported. The first column is selected.
    communityid = models.CharField(max_length=16, db_column='CommunityID')  # Field name made lowercase.
    joindate = models.DateField(db_column='JoinDate', auto_now_add=True)  # Field name made lowercase.
    memberid = models.CharField(db_column='MemberID', max_length=16, primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Members'