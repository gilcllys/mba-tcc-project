from django.db import models

# Create your models here.


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Order(BaseModel):
    client_id = models.IntegerField(
        null=False,
        blank=False,
        db_column='Client ID'
    )
    order_item_id = models.IntegerField(
        null=False,
        blank=False,
        db_column='Order Item ID'
    )

    quantity = models.IntegerField(
        null=False,
        blank=False,
        db_column='Quantity'
    )

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Oders"


class OrderItem(BaseModel):
    item_name = models.CharField(
        max_length=124,
        null=False,
        blank=False,
        db_column='Menu Item Name'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False,
        db_column='Item Price'
    )

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
