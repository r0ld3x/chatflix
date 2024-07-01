import secrets
import string

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username.strip(), email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(
            "".join(
                secrets.choice(string.ascii_letters + string.digits) for _ in range(12)
            ),
            email,
            password,
            **extra_fields,
        )


class User(AbstractUser):
    """
    A custom user model that extends the AbstractUser class provided by Django.

    Attributes:
        email (EmailField): The unique email address of the user.

        USERNAME_FIELD (str): The field used as the unique identifier for authentication. In this case, it is set to "email".

        REQUIRED_FIELDS (list): A list of fields that are required when creating a user. In this case, it is an empty list.

    """

    email = models.EmailField(unique=True, verbose_name="Email Address")
    profile_pic = models.ImageField(upload_to="profile_pics", null=True, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["password"]

    def get_username(self) -> str:
        return super().username

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        db_table = "users"

    objects = CustomUserManager()

    def get_absolute_url(self):
        return f"/users/{self.pk}/"

    def __str__(self):
        return self.email
