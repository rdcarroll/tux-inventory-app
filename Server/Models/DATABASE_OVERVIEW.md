# Database Overview

## What the database is for

The database keeps track of the information used to manage a rental business: its inventory, customers, employees, events, orders, packages, payments, and the activity performed on records.

Think of it as a set of connected record books. Each record book focuses on one kind of information, and together they help the app keep rental operations organized.

## Main areas

- **Inventory:** `inventory_items`, `inventory_types`, and `inventory` describe the items or stock the business manages. `package_inventory` appears to connect packages with inventory.
- **Customers and employees:** `customers`, `customer_sizes`, and `employees` store customer, sizing, and staff information.
- **Events and orders:** `events`, `event_types`, `event_customers`, `orders`, `order_items`, and `order_tickets` cover events and the orders or tickets associated with them.
- **Packages and payments:** `packages` describes rental or service packages; `ticket_payments` records payments associated with tickets.
- **Inventory activity:** `inventory_item_actions`, `action_types`, and `reasons` appear to describe actions affecting inventory and why they happened.
- **Reference information:** `status_types` and `reasons` provide categories used to label records consistently.
- **Administration and history:** `company` stores business information, `logs` records activity, and `access_token` supports application access.

## How the pieces work together

A typical rental process may involve recording a customer, arranging an event, creating an order, selecting inventory or a package, and recording payments. Inventory activity and logs can help staff understand what changed.

## In plain language

The database helps answer questions such as:

- What inventory does the business manage?
- Which customers and employees are recorded?
- What orders, packages, or event records exist?
- What payments and inventory activity have been recorded?
- What changes have been logged?

This overview is intended as a guide to the database’s subject areas, not as a detailed technical description.