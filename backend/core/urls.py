"""

This file defines the URL routing for the Django application.

The `urlpatterns` list routes URLs to views. For more information, please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/

Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.HomeView.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("user.urls")),
    path("room/", include("room.urls")),
    path("chat/", include("chat.urls")),
    re_path(r"^auth/", include("djoser.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
