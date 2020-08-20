import React, {useState} from "react";
import {Alert, Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
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
                <FilesUpload/>
            </Row>
        </Container>
    )
};

const CustomAlert = (props: { variant: string, message: string, link: string }) => {
    return (
        <Alert variant={props.variant}>
            {props.message}{'  '}
            {props.link !== ' ' ? <Alert.Link href={props.link}>Capture Link</Alert.Link> : null}
        </Alert>
    )
}
const Capture = () => {

    const [screenshot, setScreenShot] = useState({
        imageUrl: 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
    })
    const [alert, setAlert] = useState({
        variant: "info",
        message: "Click on Capture to detect the faces present in the webcam !!!",
        link: ' ',
        loading: false
    })

    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        () => {
            // @ts-ignore
            const imageSrc = webcamRef.current.getScreenshot();
            setScreenShot(screenshot => ({
                ...screenshot,
                imageUrl: imageSrc
            }))
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
        setAlert(alert => ({
            ...alert,
            variant: "warning",
            message: "The captured image is now loaded to the server for prediction...",
            link: ' ',
            loading: true
        }))
        console.log(image)
        bodyFormData.append('file', image, "data.jpg")
        axios.post("http://127.0.0.1:5000/facial_recognition", bodyFormData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                console.log(response)
                if (response.data.response) {
                    const results: any[] = response.data.response
                    setAlert(alert => ({
                        ...alert,
                        variant: "success",
                        message: response.status + " : Found user with id " + results[0]?.id + " and distance of " + results[0]?.distance,
                        link: response.data?.image_requested_link,
                        loading: false
                    }))
                } else if (!response.data.error && !response.data.response) {
                    setAlert(alert => ({
                        ...alert,
                        variant: "success",
                        message: response.status + " : The image provided by the webcam did not match any user in the database",
                        link: response.data?.image_requested_link,
                        loading: false
                    }))
                }

            })
            .catch((err: AxiosError) => {
                console.log(err.response)
                setAlert(alert => ({
                    ...alert,
                    variant: "danger",
                    message: err.response?.statusText + " : " + err.response?.data?.error,
                    link: err.response?.data?.image_requested_link,
                    loading: false
                }))
            })
    }

    const reset = () => {
        setScreenShot(screenshot => ({
            ...screenshot,
            imageUrl: 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
        }))

        setAlert(alert => ({
            ...alert,
            variant: "info",
            message: "Click on Capture to detect the faces present in the webcam !!!",
            link: ' ',
            loading: false
        }))
    }
    return (
        <Col md={8} className="mt-1">
            <Card>
                <Card.Header as="h5">Predict</Card.Header>
                <Card.Body>
                    <Card.Title>Take a picture for the model to predict</Card.Title>
                    <Row className="justify-content-md-center">
                        <CustomAlert variant={alert.variant} message={alert.message} link={alert.link}/>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md={7} xs={7}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                className="webCam"
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                            />
                        </Col>
                        <Col>
                            <h5>ScreenShoot Preview</h5>
                            <img src={screenshot.imageUrl} className="screnshot"/>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center mt-1">
                        <Col>
                            <Button variant="primary" onClick={capture} disabled={alert.loading}>
                                {
                                    alert.loading ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : null
                                }
                                {alert.loading ? ' Loading...' : 'Capture'}
                            </Button>
                        </Col>
                        <Col><Button variant="secondary" onClick={reset}>Reset</Button></Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

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
            message: "Images are now loaded to the server ...",
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
                    message: "Images are loaded succeffuly !",
                    link: '',
                    loading: false
                }))
                initData()
            })
            .catch((err: AxiosError) => {
                setAlert(alert => ({
                    ...alert,
                    variant: "danger",
                    message: "error: Didn't found the user",
                    link: '',
                    loading: false
                }))
            })
    }

    return (
        <Col md={8} className="mt-1">
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