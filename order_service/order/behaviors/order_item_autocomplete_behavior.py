from order.models import OrderItem


class OrderItemAutocompleteBehavior:
    def __init__(self, order_item):
        self.order_item = order_item

    def get_list_of_order_items(self):
        result = OrderItem.objects.filter(
            item_name__icontains=self.order_item).values_list("id", "item_name", "price")
        return result

    def execute(self):
        result = self.get_list_of_order_items()
        return result
