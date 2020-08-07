import React from "react";
import {Alert, Button, Col, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import * as actions from './AuthAction'
import {connect} from 'react-redux'
import {IAuthData} from "../shared/types";


const Auth = (props: any) => {

    const {register, errors, handleSubmit} = useForm<IAuthData>();

    const onSubmit = (data: IAuthData) => {
        props.onAuth(data);
    };

    return (
        <Row className="justify-content-md-center mt-4">
            <Col xl={6} md={8} sm={10}>
                <h2 className="mb-4">Login</h2>
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
            </Col>
        </Row>
    )

}
const mapDispatchToProps = (dispatch: any) => {
    return {
        onAuth: (data: IAuthData) => dispatch(actions.auth(data))
    }
}
export default connect(null, mapDispatchToProps)(Auth);
