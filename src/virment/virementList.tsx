/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, Fragment } from 'react';


import {Row, Col, Form, Button, Table, Alert} from 'react-bootstrap';
import http from '../client';
import { useHistory } from 'react-router-dom';
import {useForm} from "react-hook-form";

type Compte = {
    id : number,
    numeroCompte: string,
    intitule: string,
    soldeComptable: number
    _links : {
        self :{
            href :string
        }
    }
}
type Abonne = {
    username: string,
    nom: string,
    prenom: string
}

type Virement = {
    id: number,
    dateCreation: Date,
    motif: string,
    montant: number,
    dateExcecution: Date,
    abonne : Abonne,
    compte: Compte,
    _links : {
        self :{
            href :string
        }
    }
}




const virementList = () => {

    const comptes:Compte[] = [];
    const virements:Virement[] = [];
    const history = useHistory();




    
    const [state, setState] = useState({
        comptes: comptes,
        virements: virements
    })

    const deleteVirement = (v:Virement) => {
            http.post('delete-virement/'+v.id)
                .then(response=>{
                    setState(state =>({
                        ...state,
                        virements: state.virements.filter(vir => vir.id !== v.id )
                    }))
                })
                .catch(err =>{
                    console.log(err);
                })
    }

    const loadVirements = (url:string) =>{
        http.get(url)
            .then(response =>{
                if(response.status === 200){
                    setState({
                        ...state,
                        virements: response.data._embedded.virmentMultiples?.map((v:Virement)=>({
                            id: v.id, dateCreation: v.dateCreation, motif: v.motif, montant: v.montant, dateExecution: v.dateExcecution, 
                            abonne : {username: v.abonne.username, nom: v.abonne.nom, prenom: v.abonne.prenom }, 
                            compte: {id: v.compte.id,numeroCompte: v.compte.numeroCompte, intitule: v.compte.intitule,soldeComptable: v.compte.soldeComptable,_links: v.compte._links},
                            _links: v._links
                        }))
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const onChangeCompte = (event: any) =>{
        let url: string = event.target.value+"/virments?projection=virProj";
        loadVirements(url)
    }

    const loadComptes = () =>{
        http.get("comptes")
            .then(response =>{
                if(response.status === 200){
                    setState(state => (
                        {
                            ...state, comptes: response.data._embedded.comptes.map((e: Compte) => ({
                                id: e.id, intitule: e.intitule, numeroCompte: e.numeroCompte, soldeComptable: e.soldeComptable,_links: e._links
                            }))
                        }
                    ))
                }
            })
            .catch(err =>{
                console.log(err);
            })
    }

    const modifyVirement = (v:Virement) =>{
        console.log(v);
        history.push(
            {
                pathname: '/ajouter-virement',
                state: {
                    id: v.id
                }
            }
        )
    }

    const filterVirementList = (data:any) =>{
        console.log(data)
        data.compteNumero = data.compteNumero.toString().split('/')[(data.compteNumero.toString().split('/').length)-1];
        http.post("filter-virement",data)
            .then(response=>{
                if(response.status === 200){
                    setState({
                        ...state,
                        virements: response.data?.map((v:Virement)=>({
                            id: v.id, dateCreation: v.dateCreation, motif: v.motif, montant: v.montant, dateExecution: v.dateExcecution,
                            abonne : {username: v.abonne.username, nom: v.abonne.nom, prenom: v.abonne.prenom },
                            compte: {id: v.compte.id,numeroCompte: v.compte.numeroCompte, intitule: v.compte.intitule,soldeComptable: v.compte.soldeComptable}
                        }))
                    })
                }
            })
            .catch(err=>{
                console.log(err)
            })
    }

    useEffect(() => {
        loadComptes()
    }, []);
    return (
        <Fragment>
            <Row className="mt-4">
                <Col md={{ span: 6, offset: 3 }}>
                    <FilteringForm  comptes={state.comptes} onChangeCompte={(onChangeCompte)} filterVirementList={filterVirementList}/>
                </Col>
            </Row>
            <Row className="mt-2">
                
                <Col md={{ span: 10, offset: 1 }}>
                    <h4>List de vos virements multiples</h4>
                    <VirementTable  virements={state.virements}  deletVirement={deleteVirement}
                                    modifyVirement = {modifyVirement}
                    />
                </Col>
            </Row>
        </Fragment>
    )
}

export const VirementTable = (props:{virements:Virement[],deletVirement:Function,modifyVirement:Function}) =>{
    return (
        
        <Table striped bordered hover>
             <thead>
                <tr>
                    <th>Identifiant</th>
                    <th>Date Creation</th>
                    <th>Compte</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.virements?.map(v => {
                        return (
                        <tr key={v.id}>
                            <td>{v.id}</td>
                            <td>{v.dateCreation.toString().split('T')[0]}</td>
                            <td><a href="#">{v.compte.numeroCompte + ' '+v.compte.intitule.toUpperCase()+' '+v.abonne.nom.toUpperCase()+' '+v.abonne.prenom.toUpperCase()}</a></td>
                            <td>{v.montant}</td>
                            <td>{v.motif}</td>
                            <td>{}</td>
                            <td>
                                <Button variant="danger" onClick={()=>props.deletVirement(v)}>-</Button>
                                <Button variant="success" onClick={()=> props.modifyVirement(v)}>+</Button>
                            </td>
                        </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}
export const FilteringForm = (props : {comptes: Compte[],onChangeCompte: Function,filterVirementList:Function}) => {
    const {register, errors, handleSubmit} = useForm<any>();

    const onSubmit = (data:any) => {
        console.log(data)
        props.filterVirementList(data);
    }
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridCompte">
                    <Form.Label>Choisir un compte :</Form.Label>
                    <Form.Control as="select" name="compteNumero" ref={register({})} onChange={(e) => props.onChangeCompte(e as any)}>
                        <option></option>
                        {
                            props.comptes.map((e: Compte) => {
                                return <option key={e.id}
                                               value={e._links.self.href}>{e.numeroCompte}
                                </option>
                            })
                        }
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridDateExecution">
                    <Form.Label>Date d'éxécution :</Form.Label>
                    <Form.Control name="dateExecution" ref={register({})} type="date"/>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridMontantMin">
                    <Form.Label>Montant min :</Form.Label>
                    <Form.Control  name="montantMin" ref={register({
                        validate:(n:number)=> n > 0
                    })} type="number" />
                    {
                        (errors.montantMin?.type === 'validate') ?
                            <Alert  className='mt-2' variant="danger">Le montant doit être supérieur a 0 !!!</Alert> : null
                    }
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMontantMax">
                    <Form.Label>Montant max :</Form.Label>
                    <Form.Control name="montantMax" ref={register({
                        validate:(n:number)=> n > 0
                    })} type="number" />
                    {
                        (errors.montantMax?.type === 'validate') ?
                            <Alert  className='mt-2' variant="danger">Le montant doit être supérieur a 0 !!!</Alert> : null
                    }
                </Form.Group>
                <Form.Group as={Col} controlId="formGridStatut">
                    <Form.Label>Statut</Form.Label>
                    <Form.Control as="select" name="statut"  ref={register({})} defaultValue="Choose...">
                        <option></option>
                        <option>Enregistré</option>
                        <option>Signé et Enregistré</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit">Rechercher</Button>
        </Form>
    )
}

export default virementList;
