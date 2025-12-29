# Feature Menu Service

## Overview

I need to create a feature menu service that will be used to populate the sidenav with the list of features.
It will fetch the allowed menu items from the API and return them to the sidenav component.
This will allow us to control what features are available to the user based on their role.

## API
  GET /api/menu-items
  Mock the needed data for the sidenav. will be implemented in the backend later.

## nfr
  - The service should be lazy loaded.
  - The service should be injectable.
  - should not allow forced browsing of routes that are not allowed by the user role.
  - should cache the menu items for 5 minutes.
  
