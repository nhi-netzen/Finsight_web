import os
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib

from fastapi import UploadFile, File
from sklearn.preprocessing import RobustScaler, MinMaxScaler
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext

# ==========================================
# CẤU HÌNH CƠ SỞ DỮ LIỆU
# ==========================================
DATABASE_URL = "sqlite:///./financial_portal.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# Khởi tạo Admin mẫu
db = SessionLocal()
if not db.query(UserDB).filter(UserDB.username == "admin").first():
    db.add(UserDB(username="admin", email="admin@finsight.ai", full_name="Quản trị viên FinSight", hashed_password=pwd_context.hash("Password123")))
    db.commit()
db.close()

# ==========================================
# KHỞI TẠO APP & CORS
# ==========================================
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
# ==========================================
# PYDANTIC SCHEMAS
# ==========================================
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str

# ==========================================
# API ENDPOINTS
# ==========================================

@app.post("/api/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == request.username).first()
    if not user or not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Tên đăng nhập hoặc mật khẩu không đúng!")
    return {"message": "Thành công", "user": {"name": user.full_name, "email": user.email}}

@app.post("/api/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Kiểm tra trùng username
    if db.query(UserDB).filter(UserDB.username == request.username).first():
        raise HTTPException(status_code=400, detail="Tên đăng nhập này đã tồn tại!")
    # Kiểm tra trùng email
    if db.query(UserDB).filter(UserDB.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký!")
        
    new_user = UserDB(
        username=request.username,
        email=request.email,
        full_name=request.full_name,
        hashed_password=pwd_context.hash(request.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "Đăng ký tài khoản thành công!"}

@app.post("/api/forgot-password")
def forgot_password(payload: dict):
    # Mô phỏng tính năng quên mật khẩu
    return {"message": "Hệ thống đã gửi hướng dẫn khôi phục đến Email của bạn!"}
