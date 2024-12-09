from django.db import models

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