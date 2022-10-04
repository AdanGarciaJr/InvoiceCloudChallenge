import React, { useState } from "react";
import CustomerCreateForm from "./components/CustomerCreateForm"
import CustomerEditForm from "./components/CustomerEditForm"


function App() {

  const [customers, setCustomers] = useState([])
  const [showingCreateForm, setShowingCreateForm] = useState(false)
  const [customerCurrentlyEdited, setCustomerCurrentlyEdited] = useState(null)

  // This gets all the customers from the API
  function getCustomers(){
    const url = "http://localhost:5022/api/customers/"

    fetch(url, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(customersFromServer => {
      console.log(customersFromServer)
      setCustomers(customersFromServer)
    })
    .catch((error) => {
      console.log(error)
      alert(error)
    })
  }

  // This function deletes a customer
  function deleteCustomer(id){
    const url = "http://localhost:5022/api/customers/deletecustomer?deleteid=" + id;

    fetch(url, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(responseFromServer => {
      console.log(responseFromServer);
      onCustomeDeleted(id)
    })
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateForm === false && customerCurrentlyEdited === null) && (
            <div>
              <h1 className="mx-auto">ASP.NET Core React</h1>
              <div className="mt-5">
                <button onClick={getCustomers} className="btn btn-dark btn-lg w-75">Get Customers From Server</button>
                <button onClick={() => setShowingCreateForm(true)} className="btn btn-success btn-lg w-75 mt-4">Create New Customer</button>
              </div>
            </div>
          )}

          {(customers.length > 0 && showingCreateForm === false && customerCurrentlyEdited === null) && renderPostsTable()}

          {showingCreateForm && <CustomerCreateForm onCustomerCreated={onCustomerCreated}/>}

          {customerCurrentlyEdited !== null && <CustomerEditForm customer={customerCurrentlyEdited} onCustomerEdited={onCustomerEdited} />} 
        </div>
      </div> 
    </div>
  );

  function renderPostsTable() {
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered coreder-dark">
          <thead>
            <tr>
              <th scope="col">CustomerId (PK)</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">City</th>
              <th scope="col">State</th>
              <th scope="col">Zip</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust)=>(
              <tr key={cust.id}>
              <th scope="row">{cust.id}</th>
              <td>{cust.name}</td>
              <td>{cust.address}</td>
              <td>{cust.city}</td>
              <td>{cust.state}</td>
              <td>{cust.zip}</td>
              <td>
                <button onClick={()=> setCustomerCurrentlyEdited(cust)} className="btn btn-primary btn-lg mx-3 my-3">Update</button>
                <button onClick={() => { if(window.confirm("Are you sure you want to delete this customer?")) deleteCustomer(cust.id)}} className="btn btn-danger btn-lg mx-3 my-3">Delete</button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  // This function will run when a customer is created.
  function onCustomerCreated(createdCustomer){
    setShowingCreateForm(false)
    if(createdCustomer === null){
      return;
    }

    alert('Customer Created!')

    getCustomers();
  }
// This function will run when a customer is edited.
  function onCustomerEdited(editedCustomer){
    setCustomerCurrentlyEdited(null)

    if(editedCustomer === null){
      return
    }
    let customerCopy = [...customers];

    const index = customerCopy.findIndex((customerCopyCx, currentIndex) =>{
      if(customerCopyCx.id === editedCustomer.id){
        return true;
      }      
    })
    if(index !== -1){
      customerCopy[index] = editedCustomer;
    }

    setCustomers(customerCopy)

    alert("Edited Successfully")
  }
// This function will run when a customer is deleted.
  function onCustomeDeleted(deletedId){
    let customerCopy = [...customers]

    const index = customerCopy.findIndex((customerCopyCx, currentIndex) =>{
      if(customerCopyCx.id === deletedId){
        return true;
      }      
    })
    if(index !== -1){
      customerCopy.splice(index, 1);
    }
    
    setCustomers(customerCopy);
    
    alert('Deleted Successfully'); 
    
  }
  
}

export default App;
