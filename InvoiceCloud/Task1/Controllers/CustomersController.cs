using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Reflection;
using InvoiceCloudTask1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace Task1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        List<Customer> _oCustomers = new List<Customer>();
        // Connection to the Database
        OleDbConnection connection = new OleDbConnection(@"Provider=Microsoft.ACE.OLEDB.12.0;
        Data Source=" + Directory.GetCurrentDirectory() + "/CustomersDbNew.accdb");

        // This gets all the customers from the database
        [HttpGet]
        public IActionResult Gets()
        {
            if (_oCustomers.Count == 0)
            {
                Console.WriteLine("This is zero");
                Connect data = new Connect();

                DataTable dt = data.run();

                foreach (DataRow row in dt.Rows)
                {
                    Customer customer = new Customer();
                    string id = row["CustomerID"].ToString();
                    int idNum = Int32.Parse(id);
                    string zip = row["Zip"].ToString();
                    int zipNum;
                    int.TryParse(zip, out zipNum);
                    customer.Id = idNum;
                    customer.Name = row["Name"].ToString();
                    customer.Address = row["Address"].ToString();
                    customer.City = row["City"].ToString();
                    customer.State = row["State"].ToString();
                    customer.Zip = zipNum;
                    _oCustomers.Add(customer);
                }
            }

            if (_oCustomers.Count == 0)
            {

                return NotFound("Not Found");
            }
            return Ok(_oCustomers);
        }

        // This gets a single customer from the database
        [HttpGet("customer")]
        public IActionResult Get(int customerId)
        {

            Customer oCustomer = _oCustomers.SingleOrDefault(x => x.Id == customerId);

            if (oCustomer == null)
            {
                return NotFound("Not Found");
            }
            return Ok(oCustomer);
        }

        // This posts a new customer to the database
        [HttpPost]
        public IActionResult Save(Customer oCustomer)
        {
            try
            {

                OleDbCommand command = new OleDbCommand("INSERT into Customers(Name, Address, City, State, Zip) Values(@Name, @Address, @City, @State, @Zip)");
                command.Connection = connection;

                connection.Open();

                command.Parameters.Add("@Name", OleDbType.VarChar).Value = oCustomer.Name;
                command.Parameters.Add("@Address", OleDbType.VarChar).Value = oCustomer.Address;
                command.Parameters.Add("@City", OleDbType.VarChar).Value = oCustomer.City;
                command.Parameters.Add("@State", OleDbType.VarChar).Value = oCustomer.State;
                command.Parameters.Add("@Zip", OleDbType.Integer).Value = oCustomer.Zip;

                command.ExecuteNonQuery();

            }
            catch (Exception e)
            {
                string mess = "Error" + e;
            }
            finally
            {
                connection.Close();
            }

            _oCustomers.Add(oCustomer);

            if (_oCustomers.Count == 0)
            {
                return NotFound("Not Found");
            }
            return Ok(_oCustomers);
        }

        //This updates an existing customer
        [HttpPut("customer")]
        public IActionResult Edit(Customer oCustomer)
        {
            try
            {

                OleDbCommand command = new OleDbCommand("UPDATE Customers SET Name = @Name, Address = @Adress, City = @City, State = @State, Zip = @Zip WHERE CustomerID = " + oCustomer.Id);
                command.Connection = connection;

                connection.Open();

                command.Parameters.Add("@Name", OleDbType.VarChar).Value = oCustomer.Name;
                command.Parameters.Add("@Address", OleDbType.VarChar).Value = oCustomer.Address;
                command.Parameters.Add("@City", OleDbType.VarChar).Value = oCustomer.City;
                command.Parameters.Add("@State", OleDbType.VarChar).Value = oCustomer.State;
                command.Parameters.Add("@Zip", OleDbType.Integer).Value = oCustomer.Zip;

                command.ExecuteNonQuery();

                _oCustomers.Add(oCustomer);
            }
            catch (Exception e)
            {
                string mess = "Error" + e;
            }
            finally
            {
                connection.Close();
            }
            return Ok(_oCustomers);
        }

        //This deletes a customer from the database
        [HttpGet("deletecustomer")]
        public IActionResult Delete(int deleteid)
        {
            try
            {

                OleDbCommand command = new OleDbCommand("DELETE FROM Customers WHERE CustomerId = " + deleteid);
                command.Connection = connection;

                connection.Open();

                command.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                string mess = "Error" + e;
            }
            var oCustomer = _oCustomers.SingleOrDefault(x => x.Id == deleteid);
           
            return Ok(_oCustomers);
        }

    }

    // This class connects to the database and returns the data in the form of a data table.
    class Connect
    {

        OleDbConnection connection = new OleDbConnection(@"Provider=Microsoft.ACE.OLEDB.12.0;
        Data Source=" + Directory.GetCurrentDirectory() + "/CustomersDbNew.accdb;");
        public DataTable run()
        {
            DataTable dt = new DataTable();
            try
            {
                connection.Open();
                OleDbDataAdapter da = new OleDbDataAdapter("select * from customers", connection);
                da.Fill(dt);
                string name = dt.Rows[0]["name"].ToString();
                Console.WriteLine(name);
            }
            catch (Exception e)
            {
                string mess = "Error" + e;
            }
            finally
            {
                connection.Close();
            }
            return dt;
        }
    }

}
