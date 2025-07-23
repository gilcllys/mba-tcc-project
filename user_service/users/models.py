from django.db import models

# Create your models here.


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Client(BaseModel):
    name = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        db_column='Client name'
    )

    email = models.EmailField(
        unique=True,
        null=False,
        blank=False,
        db_column='Client email'
    )

    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
