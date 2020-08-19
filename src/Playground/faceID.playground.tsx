import React, {useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Webcam from "react-webcam";
import "./style.css"
import axios, {AxiosError} from "axios";



const Playground = () => {

    return (
        <Container className="mt-3">
            <Row className="justify-content-md-center">
                <Capture/>
            </Row>
            <Row className="justify-content-md-center mt-1">
               <FilesUpload />
            </Row>
        </Container>
    )
};

const Capture = () =>{
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
            faceRec(imageSrc)
        },
        [webcamRef]
    );

    const videoConstraints = {
        facingMode: "user"
    };

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
    return (
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
    )
}

const FilesUpload = () => {
    const previews:string[] = []
    const uploads:any[] = []

    // state for the images preview
    const [filesPreview,setFilesPreview] = useState({
        previews
    })
    //state for the files(images) chosen by the user
    const [filesUpload,setFilesUpload] = useState({uploads})




    // this function is triggered when the user select an image
    const chooseImage = (e:any) =>{
        //TODO : add a cheek to the file extension => (jpeg,png or jpg)
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

    const deleteImage = (elementIndex:number)=>{
        //delete after user confirmation
        if(window.confirm("Confirm that you want to delete the  "+(elementIndex+1)+" image?"))
        {
            setFilesPreview(filesPreview=>({
                ...filesPreview,
                previews:filesPreview.previews?.filter((value,idx) => idx !== elementIndex)
            }))
            setFilesUpload(filesUpload=>({
                ...filesUpload,
                uploads: filesUpload.uploads?.filter((value:any,idx)=> idx !== elementIndex)
            }))
        }
    }
    return (
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
    )
}


export default Playground;