# Application Design Overview

## Purpose

This application supports the day-to-day work of a tuxedo rental office. It should help staff manage customers, events, rental orders, inventory, packages, and payments from a consistent place.

**Status:** This is a high-level draft based on the rental-office context and names of the database models. The exact screens, server framework, UI framework, and workflows should be confirmed against the application source.

## User roles

Likely users include:

- **Office staff**, who handle customers, events, fittings, orders, and payments.
- **Inventory staff**, who check availability and record inventory activity.
- **Managers or administrators**, who maintain reference information and review activity.

The application’s actual roles and permissions come from the available model list.

## Screens and workflows

These are proposed screens based on the data areas in the models.

### Dashboard

A starting point for staff, with quick links and a summary of work that may need attention—for example, upcoming events, open orders, or inventory issues. The available models do not confirm which summaries are currently supported.

### Customers

Search and view customer records, with access to customer details and sizing information. The `customers` and `customer_sizes` models suggest these are separate data areas.

### Events

View and manage event records, including event type and associated customers. The `events`, `event_types`, and `event_customers` models suggest these concepts are represented in the database.

### Orders

Create or review rental orders and their items or tickets. The `orders`, `order_items`, and `order_tickets` models suggest order-related records are stored separately. The exact order lifecycle and screen layout need to be verified.

### Inventory

Browse inventory and its types, and review inventory-related activity. The `inventory_items`, `inventory_types`, `inventory`, and `inventory_item_actions` models suggest the application distinguishes items, stock, and actions.

### Packages

View or manage rental packages and the inventory associated with them. The `packages` and `package_inventory` models suggest this relationship exists.

### Payments

Review ticket-related payment records. The `ticket_payments` model suggests payments are associated with tickets; payment methods, balances, and refund workflows are not known.

### Staff and administration

Manage employee and company information, where permitted. Reference data such as statuses, action types, and reasons may also be maintained here. The available model names do not establish which of these functions are exposed in the UI.

### Activity history

Review recorded changes or operational activity, if the application exposes this information. The `logs` model suggests activity is recorded, but its contents and visibility are not known.

## Server-side design

The model files indicate a JavaScript-based server data layer. The server and API are Node JS, with Mongoose ORM for MYSQL database.

A typical request flow for this kind of application is:

1. The UI sends a request to the server.
2. The server validates the request and applies business rules.
3. The server reads or updates records through the data layer.
4. The server returns a result for the UI to display.

The server uses routes, controllers, services for Mongoose ORM. These details should be documented after reviewing the server entry point, API routes, configuration, and model definitions.

### Server setup to document

Confirm and add the project-specific details for:

- Required runtime and package manager
- How to install dependencies and start the server
- Environment variables and configuration
- Database type, connection setup, and migrations or schema creation
- API routes and authentication approach
- Error handling and logging

Do not place real credentials in this document; refer to an example environment file instead.

## UI stack

The UI framework and build tools cannot be identified from the model files. Confirm them by reviewing the client-side package manifest and application entry points.

When documenting the implementation, include:

- UI framework and version
- Routing and state-management approach
- Styling or component library
- How the UI is started and built
- How it communicates with the server

## Design considerations

- Make common staff tasks—finding a customer, checking an order, and reviewing inventory—easy to reach.
- Use clear statuses and labels so staff can understand records without database knowledge.
- Validate important information before saving, and provide helpful error messages.
- Restrict sensitive or administrative actions to authorized users.
- Keep customer and payment information visible only where needed for the task.

## Items to verify

Before treating this document as a description of the implemented application, inspect the client source, server entry point, API routes, configuration, and model definitions. Confirm which proposed screens exist and how their workflows operate.
