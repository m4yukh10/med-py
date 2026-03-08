from database import Base
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum



class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=False, index=True)
    address = Column(String, nullable=False)

    
    hospital_bookings = relationship("HospitalBooking", back_populates="user")
    ambulance_bookings = relationship("AmbulanceBooking", back_populates="user")
    doctor_bookings = relationship("DoctorBooking", back_populates="user")



class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False, unique=True)
    ccuBeds = Column(Integer, default=0)
    icuBeds = Column(Integer, default=0)
    generalWard = Column(Integer, default=0)

    hospital_bookings = relationship("HospitalBooking", back_populates="hospital")



class Ambulance(Base):
    __tablename__ = "ambulances"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vehicle_name = Column(String, unique=True, nullable=False)
    vehicle_driver = Column(String, nullable=False)
    driver_contact = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    
    ambulance_bookings = relationship("AmbulanceBooking", back_populates="ambulance")

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    dob = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    
    doctor_bookings = relationship("DoctorBooking", back_populates="doctor")



class BookingStatus(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class BedType(enum.Enum):
    CCU = "CCU"
    ICU = "ICU"
    GENERAL = "GENERAL"

class HospitalBooking(Base):
    __tablename__ = "hospital_bookings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    hospital_id = Column(UUID(as_uuid=True), ForeignKey("hospitals.id", ondelete="CASCADE"))
    bed_type = Column(Enum(BedType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


    user = relationship("User", back_populates="hospital_bookings")
    hospital = relationship("Hospital", back_populates="hospital_bookings")


class AmbulanceBooking(Base):
    __tablename__ = "ambulance_bookings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    ambulance_id = Column(UUID(as_uuid=True), ForeignKey("ambulances.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="ambulance_bookings")
    ambulance = relationship("Ambulance", back_populates="ambulance_bookings")


class DoctorBooking(Base):
    __tablename__ = "doctor_bookings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="CASCADE"))
    status = Column(Enum(BookingStatus), default=BookingStatus.pending)
    appointment_time = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="doctor_bookings")
    doctor = relationship("Doctor", back_populates="doctor_bookings")
