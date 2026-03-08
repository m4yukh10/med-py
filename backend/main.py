from fastapi import FastAPI, Depends, Request,UploadFile, File
from sqlalchemy.orm import Session
from ai.claude import explain_image
import models, schemas
from database import engine, SessionLocal

import cloudinary
import cloudinary.uploader

models.Base.metadata.create_all(engine)


app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
    
@app.get("/")
def hello():
    return {"message": "hello world!"}
    

@app.post("/hospitalregister", response_model=schemas.Hospital)
def add_hospital(request: schemas.Hospital, db: Session = Depends(get_db)):
    new_hospital = models.Hospital(name=request.name, ccuBeds=request.ccuBeds, icuBeds=request.icuBeds, generalWard=request.generalWard)
    db.add(new_hospital)
    db.commit()
    db.refresh(new_hospital)
    
    return new_hospital


@app.get("/hospitalregister", response_model=list[schemas.Hospital])
def get_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(models.Hospital).all()
    return hospitals

@app.put("/updatehospital", response_model = schemas.Hospital)
def update_hospitals(request: schemas.Hospital, db: Session = Depends(get_db)):
    hospital = db.query(models.Hospital).filter(models.Hospital.name == request.name).first()
    
    hospital.ccuBeds = request.ccuBeds
    hospital.icuBeds = request.icuBeds
    hospital.generalWard = request.generalWard

    db.commit()
    db.refresh(hospital)
    
    return hospital

@app.post("/adduser", response_model=schemas.User)
def add_user(request: schemas.UserCreate, db: Session = Depends(get_db)):
    newUser = models.User(name=request.name, contact = request.contact, address = request.address)
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    
    return newUser

@app.get("/adduser", response_model=list[schemas.User])
def dispUser(db: Session = Depends(get_db)):
    goonUser = db.query(models.User).all()
    
    return goonUser

@app.post("/bookhospitals", response_model=schemas.HospitalBooking)
def bookHospital(request: schemas.HospitalBookingCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == request.name).first()
    user_id = user.id if user else None
    
    hospital = db.query(models.Hospital).filter(models.Hospital.name == request.hospital).first()
    hospital_id = hospital.id if hospital else None
    
    bed_type = request.bed_type.upper()
    
    if bed_type == "CCU":
        hospital.ccuBeds -= 1
    elif bed_type == "ICU":
        hospital.icuBeds -= 1
    elif bed_type == "GENERAL":
        hospital.generalWard -= 1
    
    new_booking = models.HospitalBooking(user_id=user_id, hospital_id=hospital_id, bed_type=bed_type)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking

@app.post("/ambulances", response_model=schemas.Ambulance)
def createAmbulance(request: schemas.AmbulanceRegister, db: Session = Depends(get_db)):
    newAmbulance = models.Ambulance(vehicle_name=request.vehicle_name, vehicle_driver=request.vehicle_driver, driver_contact=request.driver_contact, quantity=request.quantity)
    db.add(newAmbulance)
    db.commit()
    
    db.refresh(newAmbulance)
    
    return newAmbulance

@app.get("/ambulances", response_model=list[schemas.Ambulance])
def getAmbulances(db: Session = Depends(get_db)):
    allAmbulances = db.query(models.Ambulance).all()
    
    return allAmbulances

@app.post("/bookambulances", response_model=schemas.AmbulanceBooking)
def bookAmbulance(request: schemas.BookAmbulance, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == request.name).first()
    user_id = user.id if user else None
    
    ambulance = db.query(models.Ambulance).filter(models.Ambulance.name == request.vehicleName).first()
    ambulance_id = ambulance.id if ambulance else None
    
    ambulance_count = ambulance.quantity
    
    if ambulance_count > 0:
        ambulance_count -= 1
    
    ambulance_booked = models.AmbulanceBooking(user_id=user_id, ambulance_id=ambulance_id)
    db.add(ambulance_booked)
    db.commit()
    db.refresh(ambulance_booked)
    
    return ambulance_booked

@app.post("/doctorsregister", response_model=schemas.Doctor)
def addDoctor(request: schemas.Doctor, db: Session = Depends(get_db)):
    newDoctor = models.Doctor(name=request.name, specialization=request.specialization, dob=request.dob, gender=request.gender)
    db.add(newDoctor)
    db.commit()
    db.refresh(newDoctor)
    
    return newDoctor 

@app.get("/doctors", response_model=list[schemas.Doctor])
def getDoctors(db: Session = Depends(get_db)):
    allDoctors = db.query(models.Doctor).all()
    
    return allDoctors 


@app.post("/ai-upload")
async def ai_upload(my_image: UploadFile = File(...)):
    
    contents = await my_image.read()  

    # Upload to Cloudinary
    upload_response = cloudinary.uploader.upload(contents, resource_type="image")
    image_url = upload_response["secure_url"]

    
    explanation = explain_image(image_url)

    return {"image_url": image_url, "explanation": explanation}