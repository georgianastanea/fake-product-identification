import React from "react";
import { Grid, Image, Card } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import manufacturer from "./resources/manufacturer.png";
import supplier from "./resources/supplier.png";
import customer from "./resources/customer.png";

const Home = () => {

  const navigate = useNavigate();

  const handleManufacturer = () => {
    navigate('/manufacturer');
  };

  const handleSupplier = () => {
    navigate('/supplier');
  };
  
  const handleCustomer = () => {
    navigate('/customer');
  };

  return (
    <div>
      <h3 style={{ padding:'20px'}}>Who are you?</h3>
      <Grid columns={3} container stackable>
        <Grid.Row>
          <Grid.Column>
            <Card link onClick={handleManufacturer}>
              <Image src={manufacturer} wrapped ui={false} />
              <Card.Content>
                <Card.Header textAlign="center">Manufacturer</Card.Header>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card link onClick={handleSupplier}>
              <Image src={supplier} wrapped ui={false} />
              <Card.Content>
                <Card.Header textAlign="center">Supplier</Card.Header>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card link onClick={handleCustomer}>
              <Image src={customer} wrapped ui={false} />
              <Card.Content>
                <Card.Header textAlign="center">Customer</Card.Header>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;