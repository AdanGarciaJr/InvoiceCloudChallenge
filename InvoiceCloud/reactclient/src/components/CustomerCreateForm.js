import React, { useState } from "react";

//create customer with this form
function CustomerCreateForm(props){
    const initialFormData = Object.freeze({
        name: "John Doe",
        address: "123 Street Drive",
        city: "City",
        state: "TX",
        zip: "11111"
    })
    const [formData, setFormData] = useState(initialFormData)
    const url = "http://localhost:5022/api/customers"
    
    
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const customerToCreate = {
            postId: 0,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
        }
        fetch(url, {
            method: 'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify(customerToCreate)
          })
          .then(response => response.json())
          .then(responseFromServer => {
            console.log(responseFromServer)
          })
          .catch((error) => {
            console.log(error)
            alert(error)
          })
          props.onCustomerCreated(customerToCreate)
    }

    return(
        <div>
            <form className="w-100 px-5">
                <h1 className="mt-5">Create New Customer</h1>
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
                <button onClick={() => props.onCustomerCreated(null)} className="btn btn-danger btn-lg w-100 mt-3">Cancel</button>
            </form>
        </div>
    )
}

export default CustomerCreateForm