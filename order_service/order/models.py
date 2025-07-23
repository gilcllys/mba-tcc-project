from django.db import models

# Create your models here.


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Order(BaseModel):
    item = models.CharField(
        max_length=124,
        null=False,
        blank=False,
        db_column='Menu Item Name'
    )

    quantity = models.IntegerField(
        null=False,
        blank=False,
        db_column='Quantity'
    )

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Oders"
