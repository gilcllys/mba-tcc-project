from users.models import Client


class UserAutocompleteBehavior:
    def __init__(self, user):
        self.user = user

    def get_list_of_users(self):
        result = Client.objects.filter(
            name__icontains=self.user).values_list("id", "name", "email")
        return result

    def execute(self):
        result = self.get_list_of_users()
        return result
