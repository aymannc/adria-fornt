import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import client from "../app/Client";
import Webcam from "react-webcam";
import {AxiosError, AxiosResponse} from "axios";

export const CustomAlert = (props: { variant: string, message: string, link: string }) => {
    return (
        <Alert variant={props.variant}>
            {props.message}{'  '}
            {props.link !== ' ' ? <Alert.Link target="_blank" href={props.link}>Capture Link</Alert.Link> : null}
        </Alert>
    )
}

export interface CaptureProps {
    backEndUrl: string | null;
    onSuccess: Function | null;
    onError: Function | null;

}

export interface AlertI {
    variant: string,
    message: string,
    link: string,
    loading: boolean
}

export const Capture = (captureProps: CaptureProps) => {

    const [screenshot, setScreenShot] = useState({
        imageUrl: 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
    })
    const [alert, setAlert] = useState({
        variant: "info",
        message: "Click on Capture to detect the faces present in the webcam !!!",
        link: ' ',
        loading: false
    } as AlertI)

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
    const handleSuccess = (response: AxiosResponse) => {
        console.log(response)
        if (response.data.response) {
            const results: any[] = response.data.response
            setAlert({
                variant: "success",
                message: response.status + " : The user is " + results[0]?.username +
                    " with id: " + results[0]?.id + " and distance of " + results[0]?.distance,
                link: response.data?.image_requested_link,
                loading: false
            })
        } else if (!response.data.error && !response.data.response) {
            setAlert({
                variant: "success",
                message: response.status + " : The image provided by the webcam did not match any user in the database",
                link: response.data?.image_requested_link,
                loading: false
            })
        }
    }
    const handleError = (error: AxiosError) => {
        console.log(error.response)
        setAlert((alert: AlertI) => ({
            variant: "danger",
            message: error.response?.statusText + " : " + error.response?.data?.error.toString().split('in')[0],
            link: error.response?.data?.image_requested_link,
            loading: false
        }))
    }

    const faceRec = async (data: any) => {
        const image = await fetch(data).then(res => res.blob())
        const bodyFormData = new FormData();
        setAlert(alert => ({
            variant: "warning",
            message: "Uploading the picture ...",
            link: ' ',
            loading: true
        }))
        bodyFormData.append('file', image, "data.jpg")
        client.post(captureProps?.backEndUrl || "http://127.0.0.1:5000/facial_recognition", bodyFormData,
            {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                const onSuccess = captureProps.onSuccess
                if (onSuccess) {
                    onSuccess(response, setAlert)
                } else handleSuccess(response)
            })
            .catch(error => {
                const onError = captureProps.onError
                if (onError) {
                    onError(error, setAlert)
                } else handleError(error)
            })
    }

    const reset = () => {
        setScreenShot(screenshot => ({
            ...screenshot,
            imageUrl: 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
        }))

        setAlert(alert => ({
            variant: "info",
            message: "Click on Capture to detect the faces present in the webcam !!!",
            link: ' ',
            loading: false
        }))
    }
    return (
        <div>
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

            <Row className="justify-content-md-center mx-auto mt-2">
                <Col className='col-3'>
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
                <Col className='col-3 ml-auto'><Button variant="secondary" onClick={reset}>Reset</Button></Col>
            </Row>
        </div>
    )
}
