stockmaster/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── assets/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── db.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── stock.py
│   │   │   ├── receipt.py
│   │   │   ├── delivery.py
│   │   │   ├── internal_transfer.py
│   │   │   └── adjustments.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── product_routes.py
│   │   │   ├── receipt_routes.py
│   │   │   ├── delivery_routes.py
│   │   │   ├── transfer_routes.py
│   │   │   ├── adjustment_routes.py
│   │   │   └── dashboard_routes.py
│   │   │
│   │   ├── services/
│   │   │   ├── stock_service.py
│   │   │   └── report_service.py
│   │   │
│   │   ├── utils/
│   │   │   ├── otp.py
│   │   │   ├── jwt_handler.py
│   │   │   ├── validators.py
│   │   │   └── logger.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── README.md
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
└── docs/
    ├── api_documentation.md
    ├── system_design.excalidraw
    └── project_plan.md