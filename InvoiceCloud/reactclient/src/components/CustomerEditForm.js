import React, { useState } from "react";

function CustomerEditForm(props){
    const initialFormData = Object.freeze({
        id:props.customer.id,
        name: props.customer.name,
        address: props.customer.address,
        city: props.customer.city,
        state: props.customer.state,
        zip: props.customer.zip
    })
    const [formData, setFormData] = useState(initialFormData)
    const url = "http://localhost:5022/api/customers/customer"
    
    
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const customerToEdit = {
            id: formData.id,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
        }
        fetch(url, {
            method: 'PUT',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify(customerToEdit)
          })
          .then(response => response.json())
          .then(responseFromServer => {
            console.log(responseFromServer)
          })
          .catch((error) => {
            console.log(error)
            alert(error)
          })
          props.onCustomerEdited(customerToEdit)
    }

    return(
        <div>
            <form className="w-100 px-5">
                <h1 className="mt-5">Edit Customer, "{props.customer.name}".</h1>
                <div className="mt-5">
                    <label className="h3 form-label">Name</label>
                    <input value={formData.name} name="name" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <div className="mt-4">
                    <label className="h3 form-label">Address</label>
                    <input value={formData.address} name="address" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <div className="mt-3">
                    <label className="h3 form-label">City</label>
                    <input value={formData.city} name="city" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <div className="mt-2">
                    <label className="h3 form-label">State</label>
                    <input value={formData.state} name="state" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <div className="mt-1">
                    <label className="h3 form-label">Zip</label>
                    <input value={formData.zip} name="zip" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <button onClick={handleSubmit} className="btn btn-primary btn-lg w-100 mt-5">Submit</button>
                <button onClick={() => props.onCustomerEdited(null)} className="btn btn-danger btn-lg w-100 mt-3">Cancel</button>
            </form>
        </div>
    )
}

export default CustomerEditForm