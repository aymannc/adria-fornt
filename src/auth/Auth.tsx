import React from "react";
import {Alert, Button, Container, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import http from '../client'

interface IFormInput {
    username: string;
    password: string;
}

const Auth = () => {

    const {register, errors, handleSubmit} = useForm<IFormInput>();

    const onSubmit = (data: IFormInput) => {
        console.log(data)
        http.post('/login', data, {}).then(results => {
            console.log(results)
            const config = {
                headers: {Authorization: `${results.headers.authorization}`}
            };
            http.get('abonnes', config).then(l3ilm => {
                console.log('data ', l3ilm.data._embedded.abonnes)
            })
        }).catch((error) => {
            console.log(error);
        })
    };

    return <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="text"
                              name="username"
                              placeholder="Enter username"
                              ref={register({required: true})}/>
                {
                    (errors.username?.type === 'required') ?
                        <Alert className='mt-2' variant="danger">{"First name is required"}</Alert> : null
                }
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password"
                              type="password"
                              placeholder="Password"
                              ref={register({required: true})}/>
                {
                    (errors.password?.type === 'required') ?
                        <Alert className='mt-2' variant="danger">{"Password is required"}</Alert> : null
                }
            </Form.Group>
            <Button variant="primary" type={"submit"}>
                Submit
            </Button>
        </Form>
    </Container>

}
export default Auth;
