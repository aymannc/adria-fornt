import React, {useState} from "react";
import {Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import "./style.css"
import axios, {AxiosError} from "axios";
import {Capture, CaptureProps, CustomAlert} from "../shared/Capture";


const Playground = () => {
    const captureProps: CaptureProps = {
        backEndUrl: null, onError: null, onSuccess: null
    }
    return (
        <Container className="mt-3">
            <Row className="justify-content-md-center">
                <Col md={10} className="mt-1">
                    <Card>
                        <Card.Header as="h5">Predict</Card.Header>
                        <Card.Body>
                            <Card.Title>Take a picture for the model to predict</Card.Title>
                            <Capture {...captureProps}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-1">
                <FilesUpload/>
            </Row>
        </Container>
    )
};

const FilesUpload = () => {
    const previews: string[] = []
    const uploads: any[] = []

    // state for username
    const [username, setUsername] = useState('')
    // state for the images preview
    const [filesPreview, setFilesPreview] = useState({previews})
    //state for the files(images) chosen by the user
    const [filesUpload, setFilesUpload] = useState({uploads})
    //state for alert
    const [alert, setAlert] = useState({
        variant: "info",
        message: "",
        link: ' ',
        loading: false
    })


    // this function is triggered when the user select an image
    const chooseImages = (e: any) => {
        //TODO : add a cheek to the file extension => (jpeg,png or jpg)
        if (e.target.files) {
            let files = e.target?.files;
            const uploads: any[] = filesUpload.uploads?.map(upload => upload)
            const previews: string[] = filesPreview.previews?.map((file) => file)
            for (let file of files) {
                uploads.push(file)
                previews.push(URL.createObjectURL(file))
            }
            setFilesPreview(filesPreview => ({
                ...filesPreview,
                previews: previews
            }))
            setFilesUpload(filesUpload => ({
                ...filesUpload,
                uploads: uploads
            }))
            e.target.value = null;
        }

    }

    const deleteImage = (elementIndex: number) => {
        //delete after user confirmation
        if (window.confirm("Confirm that you want to delete the  " + (elementIndex + 1) + " image?")) {
            setFilesPreview(filesPreview => ({
                ...filesPreview,
                previews: filesPreview.previews?.filter((value, idx) => idx !== elementIndex)
            }))
            setFilesUpload(filesUpload => ({
                ...filesUpload,
                uploads: filesUpload.uploads?.filter((value: any, idx) => idx !== elementIndex)
            }))
        }
    }
    const initData = () => {
        setFilesPreview(filesPreview => ({
            ...filesPreview,
            previews: []
        }))
        setFilesUpload(filesUpload => ({
            ...filesUpload,
            uploads: []
        }))
        setUsername('')
        //document.getElementById("exampleFormControlFile1").reset();
    }

    const uploadImages = (e: any) => {
        e.preventDefault()
        setAlert(alert => ({
            ...alert,
            variant: "warning",
            message: "Images is being uploaded to the server ...",
            link: ' ',
            loading: true
        }))
        const bodyFormData = new FormData();
        bodyFormData.append('username', username)
        for (let file of filesUpload.uploads) {
            bodyFormData.append('files', file, file.name)
        }
        axios.post("http://127.0.0.1:5000/upload_images", bodyFormData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                setAlert(alert => ({
                    ...alert,
                    variant: "success",
                    message: "Images are loaded successfully !",
                    link: ' ',
                    loading: false
                }))
                initData()
            })
            .catch((err: AxiosError) => {
                console.log(err)
                setAlert(alert => ({
                    ...alert,
                    variant: "danger",
                    message: err.response?.statusText + " : " + err.response?.data?.error,
                    link: ' ',
                    loading: false
                }))
            })
    }

    return (
        <Col md={10} className="mt-1">
            <Card>
                <Card.Header as="h5">Upload and encode images</Card.Header>
                <Card.Body>
                    <Row className="justify-content-md-center">
                        {
                            alert.message ?
                                <CustomAlert variant={alert.variant} message={alert.message} link={alert.link}/> : ''
                        }
                    </Row>
                    <Row className="ml-2">
                        <Form onSubmit={uploadImages}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e: any) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                {/*<Form.File id="exampleFormControlFile1" label="Chosen images"
                                           onChange={(e: any) => chooseImages(e)}/>*/}
                                <Form.Label>Images</Form.Label>
                                <Form.Control
                                    id="exampleFormControlFile1"
                                    onChange={(e: any) => chooseImages(e)}
                                    type="file"
                                    multiple>
                                </Form.Control>
                            </Form.Group>
                            <div className="form-group multi-preview">
                                <Row>
                                    {filesPreview.previews?.map((file, index) => (
                                        <Col
                                            md={(12 / filesPreview.previews.length) >= 3 ? (12 / filesPreview.previews.length) : 3}
                                            xs={6} key={index}>
                                            <Row>
                                                <img className="preview" key={index} src={file} alt={file}/>
                                            </Row>
                                            <Row className="ml-4">
                                                <Button variant="danger" onClick={() => deleteImage(index)}>
                                                    -
                                                </Button>
                                            </Row>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            <Button variant="primary" type="submit" disabled={alert.loading}>
                                {
                                    alert.loading ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : null
                                }
                                {alert.loading ? ' Uploading...' : 'Upload'}
                            </Button>
                        </Form>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}


export default Playground;
