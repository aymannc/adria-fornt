import React, {Fragment, useState} from "react";
import {Redirect, useHistory, useLocation} from "react-router-dom";
import {Alert, Button, Col, Form, ListGroup, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import http from "../app/client";
import {useSelector} from "react-redux";
import {GlobalState} from "../shared/types";

type Overview = {
    id: number,
    accountNumber: string,
    createdDate: string,
    executedDate: string,
    montant: number,
    motif: string,
    nbrOfBenf: number,
    selectedBeneficiaire: {
        id: number,
        montant: string,
        nom: string,
        prenom: string
    }[]
}

interface ISignForm {
    virmentID: number,
    id: number,
    password: string
}

export const SignSuccess = () => {
    return <Row>
        <Col className="col-6 mx-auto">
            <Alert className='mt-2' variant="success">Votre demande a été signé !</Alert>
        </Col>
    </Row>
}


const SignerVirement = () => {
    const {userId, token} = useSelector(
        (state: GlobalState) => state.auth
    );

    const location = useLocation();
    const history = useHistory();
    // @ts-ignore
    let state: Overview = {...location.state?.detail};
    const {register, errors, handleSubmit} = useForm<any>();
    const [error, editError] = useState('');

    const onSubmit = (data: any) => {
        const form: ISignForm = {
            virmentID: state.id,
            id: userId ? userId : -1,
            password: data.password
        }
        http.post('sign', form, {headers: {'Authorization': token}}).then(response => {
            if (response.data === true) {
                history.push('/success')
            }
        }).catch(errors => {
            editError(errors.response.data.message);
            console.log(errors.response.data.message)
        })
    };
    return (
        <Fragment>
            {token ? null : <Redirect to="/auth"/>}
            <Row>
                <Col className="col-6 mx-auto mt-5">
                    {error !== '' ? <Alert className='mt-2' variant="danger">{error}</Alert> : null}
                </Col>
            </Row>
            <Row>
                <Col className="col-6 mx-auto">
                    <h2>Détails de virement</h2>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Numero de compte : {state.accountNumber}</ListGroup.Item>
                        <ListGroup.Item>Date de création : {state.createdDate}</ListGroup.Item>
                        <ListGroup.Item>Motif : {state.motif}</ListGroup.Item>
                        <ListGroup.Item>Nombre des bénéficiaires : {state.nbrOfBenf}</ListGroup.Item>
                        <ListGroup.Item>List des bénéficiaires :
                            <ListGroup variant="flush" className="mt-3">
                                {
                                    state.selectedBeneficiaire?.map(beneficiaire => {
                                        return (
                                            <ListGroup.Item variant="secondary" key={beneficiaire.id}>
                                                {`${beneficiaire.nom.toUpperCase()} ${beneficiaire.prenom.toUpperCase()} : ${beneficiaire.montant} DH`}
                                            </ListGroup.Item>)
                                    })
                                }
                            </ListGroup>
                        </ListGroup.Item>
                        <ListGroup.Item variant="success">Montant total : {state.montant} DH</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit(onSubmit)}>

                <Row className="col-7 mx-auto mt-4">
                    <Col className="col-6">

                        <Col>
                            <Form.Group controlId="passwordcontrolId">
                                <Form.Control type="password"
                                              name="password"
                                              placeholder="Password"
                                              ref={register({required: true})}
                                />
                            </Form.Group>
                            {
                                (errors.password?.type === 'required') ?
                                    <Alert className='mt-2' variant="danger">Vous devez entrer votre mot de
                                        passe</Alert> : null
                            }
                        </Col>
                    </Col>
                    <Col className="col-1">
                        <Button type="submit" variant="success">Signer</Button>
                    </Col>
                </Row>

            </Form>
        </Fragment>
    )
}

export default SignerVirement;
