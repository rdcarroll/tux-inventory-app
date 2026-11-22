
export class Order {
    ID: number;
    CustomerID: number;
    Customer:Customer;
    EventID: number;
    useDate: Date;
    pickUpDate: Date;
    returnDate: Date;
    actualReturnDate: Date;
    OrderTickets: any;
    createdAt: Date;
    updatedAt: Date;
}
export class OrderItem {
    ID: number;
    OrderID: number;
    CustomerID: number;
    EmployeeID: number;
    InventoryID: number;
    Confirmed: number;
    ItemSize: string;
    InventoryItemID: number;
    Cost: number;
    Inventory: any;
    pickedupDate: Date;
    returnedDate: Date;
    pulledDate: Date;
    overbooked: boolean;
    createdAt: Date;
    updatedAt: Date;
    InventoryItem: {};
    $$editing: boolean;
}
export class Customer {
    ID: number;
    FullName: string;
    LastName: string;
    FirstName: number;
    Email: string;
    Phone: string;
    Address: string;
    Orders: Order[];
    OrderTickets: any[];
    createdAt: Date;
    updatedAt: Date;
}
export class Event {
    ID: number;
    EventName: string;
    EventTypeID: number;
    Orders: Order[];
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
}