from pydantic import BaseModel, Field
from uuid import UUID
from enum import Enum

from datetime import datetime
# Hospital Schemas
class HospitalBase(BaseModel):
    name: str
    ccuBeds: int
    icuBeds: int
    generalWard: int

class Hospital(HospitalBase):
    id: UUID  # <-- type as UUID, not str

    model_config = {
        "from_attributes": True  # <-- v2 replacement for orm_mode
    }

# User Schemas
class UserBase(BaseModel):
    name: str
    contact: str
    address: str

class User(UserBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }

class UserCreate(UserBase):
    pass 
# Ambulance Schemas
class AmbulanceRegister(BaseModel):
    vehicle_name: str
    vehicle_driver: str
    driver_contact: str
    quantity: int
    
class AmbulanceBase(BaseModel):
    vehicle_name: str
    vehicle_driver: str
    driver_contact: str
    quantity: int

class Ambulance(AmbulanceBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }

# Doctor Schemas
class DoctorBase(BaseModel):
    name: str
    specialization: str
    dob: str
    gender: str

class Doctor(DoctorBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }

class BedType(str, Enum):
    CCU = "CCU"
    ICU = "ICU"
    GENERAL = "GENERAL"
class HospitalBookingCreate(BaseModel):
    name: str         # user name
    hospital: str     # hospital name
    bed_type: BedType     # ccu/icu/general
class HospitalBookingBase(BaseModel):
    user_id: UUID
    hospital_id: UUID
    bed_type: BedType
    
class HospitalBooking(HospitalBookingBase):
    id: UUID
    created_at: datetime = Field(default_factory=datetime.utcnow)  # <-- automatically sets current datetime

    model_config = {
        "from_attributes": True  # maps SQLAlchemy object attributes to Pydantic schema
    }


class AmbulanceBookingBase(BaseModel):
    user_id: UUID
    ambulance_id: UUID
    
    
class AmbulanceBooking(AmbulanceBookingBase):
    id: UUID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    model_config = {
        "from_attributes": True
    }

class BookAmbulance(AmbulanceBooking):
    pass

