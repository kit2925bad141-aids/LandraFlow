# LaundraFlow — Laundry Management System

A complete college project using the required stack:

**HTML5 + CSS3 + Vanilla JavaScript → Java Servlet → DAO → JDBC → MySQL**

No React, Node.js, Express, Spring Boot, Hibernate, JPA, Firebase, Supabase or MongoDB.

## Modules
1. Dashboard
2. Customer Registration & List
3. Create Laundry Order
4. Order Tracking
5. Billing / Invoice

## Required Java concepts
- `ArrayList<Customer>` in CustomerDAO
- `ArrayList<Order>` in OrderDAO
- `ArrayList<ClothingItem>` for order items
- `HashMap<Integer,String>` in OrderStatusManager
- JDBC `Connection`, `PreparedStatement`, `ResultSet`, `SQLException`
- Transaction for order + order items with commit/rollback

## Prices
The database keeps cloth/service prices. The UI shows a simple common service guide:
- Washing ₹50
- Ironing ₹25
- Dry Cleaning ₹120
- Delivery ₹50

The actual order calculation uses the selected cloth/service price from the same rate table used by the frontend. For the current required UI, billing is displayed as a **service-wise common summary**, not Shirt/Pant/Saree rows.

## Setup
### 1. Database
Run `database/laundry_management.sql` in MySQL.

### 2. JDBC password
Edit `backend/src/util/DBConnection.java` and replace `CHANGE_ME` with your local MySQL password. Never share the password with anyone.

### 3. Libraries
Put your downloaded:
- MySQL Connector/J JAR
- Tomcat 10.1 `jakarta.servlet-api.jar`

inside `backend/lib/`.

### 4. Compile
See `backend/README_BACKEND.md`.

### 5. Deploy
Create:

```text
Tomcat/webapps/LaundraFlow/
├── WEB-INF/
│   ├── classes/   <- compiled .class files
│   └── lib/       <- mysql connector JAR
```

Use `@WebServlet`, so no `web.xml` is required.

### 6. Start Tomcat
Set `CATALINA_HOME`, then run:

```powershell
& "$env:CATALINA_HOME\bin\startup.bat"
```

Backend base URL:
`http://localhost:8080/LaundraFlow`

### 7. Start frontend
From the `frontend` folder:

```powershell
python -m http.server 5500
```

Open:
`http://localhost:5500`

## API endpoints
- `GET/POST /customer`
- `GET/POST /order`
- `GET/POST /tracking`
- `GET/POST /billing`

## Flow

```text
Browser
  ↓
HTML + CSS + Vanilla JavaScript
  ↓ fetch()
Java Servlet
  ↓
DAO
  ↓
JDBC
  ↓
MySQL
```

Frontend never connects directly to MySQL.


## Important
Open the frontend through the Python server, not by double-clicking HTML files:

```powershell
cd frontend
python -m http.server 5500
```

Then open `http://localhost:5500`. The sidebar now has working links for Dashboard, Customers, Create Order, Tracking and Billing on every page.
