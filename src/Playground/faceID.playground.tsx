import React, {useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Webcam from "react-webcam";
import "./style.css"
import axios, {AxiosError} from "axios";



const Playground = () => {

    const previews:string[] = []
    const uploads:any[] = []
    const [filesPreview,setFilesPreview] = useState({
        previews
    })
    const [filesUpload,setFilesUpload] = useState({uploads})

    const faceRec = async (data: any) => {
        const image = await fetch(data).then(res => res.blob())
        const bodyFormData = new FormData();
        console.log(image)
        bodyFormData.append('file', image,"data.jpg")
        axios.post("http://127.0.0.1:5000/facial_recognition", bodyFormData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                console.log(response)
            })
            .catch((err:AxiosError) => {
                console.log(err.response?.data)
            })
    }
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
            faceRec(imageSrc)
        },
        [webcamRef]
    );

    const chooseImage = (e:any) =>{
        if (e.target.files[0]){
            const file = e.target?.files[0];
            const uploads:any[] = filesUpload.uploads?.map(upload=>upload)
            const previews:string[] = filesPreview.previews?.map((file)=>file)
            uploads.push(file)
            previews.push(URL.createObjectURL(file))
            setFilesPreview(filesPreview=>({
                ...filesPreview,
                previews:previews
            }))
            setFilesUpload(filesUpload=>({
                ...filesUpload,
                uploads: uploads
            }))
        }

    }

    const deleteImage = (elemntIndex:number)=>{
        //delete after user confirmation
        if(window.confirm("Confirme that you want to delete the  "+(elemntIndex+1)+" image?"))
        {
            setFilesPreview(filesPreview=>({
                ...filesPreview,
                previews:filesPreview.previews?.filter((value,idx) => idx !== elemntIndex)
            }))
            setFilesUpload(filesUpload=>({
                ...filesUpload,
                uploads: filesUpload.uploads?.filter((value:any,idx)=> idx !== elemntIndex)
            }))
            console.log(filesPreview)
            console.log(filesUpload)
        }
    }
    const videoConstraints = {
        facingMode: "user"
    };
    return (
        <Container className="mt-3">
            <Row className="justify-content-md-center">
                <Col  md={8} className="mt-1">
                    <Card>
                        <Card.Header as="h5">Predict</Card.Header>
                        <Card.Body>
                            <Card.Title>Take a picture for the model to predict</Card.Title>
                            <Row>
                                <Col md={8} xs={8}>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        className="webCam"
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                    />
                                </Col>
                                <Col>
                                    <h5>Resultas :</h5>
                                </Col>
                            </Row>
                            <Button variant="primary" onClick={capture}>Capture</Button>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
            <Row className="justify-content-md-center mt-1">
                <Col md={8} className="mt-1">
                    <Card>
                        <Card.Header as="h5">Upload and encode images</Card.Header>
                        <Card.Body>
                            <Card.Title>Upload multiple images for the server to encode</Card.Title>
                            <Row className="ml-2">
                                <Form>
                                    <div className="form-group multi-preview">
                                        <Row>
                                            {filesPreview.previews?.map((file,index)=>(
                                                <Col md={(12/filesPreview.previews.length)>=3?(12/filesPreview.previews.length):3} xs={6} key={index}>
                                                    <Row>
                                                        <img className="preview" key={index} src={file} alt={file}/>
                                                    </Row>
                                                    <Row className="ml-4">
                                                        <Button variant="danger" onClick={()=>deleteImage(index)}>-</Button>
                                                    </Row>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                    <Form.Group>
                                        <Form.File id="exampleFormControlFile1" label="Chosen images" onChange={(e:any)=>chooseImage(e)} />
                                    </Form.Group>
                                </Form>
                            </Row>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default Playground;