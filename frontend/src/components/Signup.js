import React from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Card,
    CardTitle,
    CardBody,
    InputGroup,
    InputGroupText,
    Button
}   from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faLock, faAt} from '@fortawesome/free-solid-svg-icons';
import * as actions from '../store/actions/auth';
import Loading from './Loading';

class Signup extends React.Component {

    state = {
        error: "",
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const username = e.target.elements.username.value;
        const password1 = e.target.elements.password1.value;
        const password2 = e.target.elements.password2.value;
        const patt = new RegExp("[^a-zA-Z0-9_.-]");
        const res = patt.exec(username);
        if (res !== null){
            this.setState({
                error: "Lo username può contenere solo lettere, numeri e i caratteri '.', '-' e '_'.",
            })
        }
        else if (password2 !== password1){
            this.setState({
                error: "Le password non coincidono.",
            })
        }
        else {
            this.setState({
                error: "",
            });
            this.props.onAuth(email, username, password1, password2);
        }
    };

    render() {
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <div align="center" style={{color: "red"}}>{this.props.error}</div>
            );
        }
        if (this.state.error){
            errorMessage = (
                <div align="center" style={{color: "red"}}>{this.state.error}</div>
            );
        }
        if (this.props.token) {
            return (
                <div align={"center"}>Ti sei registrato con successo.<br/>
                    Il tuo profilo è un po' anonimo, cambia l'immagine del profilo!<br/>
                    <a href="/profile/" className={"btn"}
                       style={{color: "#fff", backgroundColor: "#64c4ed", border: "0"}}>Profilo</a><br/>
                    Oppure vai alla home e scopri cosa puoi fare.<br/>
                    <a href="/" className={"btn"}
                       style={{color: "#fff", backgroundColor: "#64c4ed", border: "0"}}>Home</a>
                </div>
            )
        } else
            return (
                <div>
                    {errorMessage}
                    {this.props.loading ?
                        <Loading/>
                        :
                        <Container style={{position: "relative", top: "150px"}}>
                            <Row className="justify-content-center">
                                <Col className="col-lg-4 col-md-6 mb-4 mb-md-0">
                                    <Card style={{backgroundColor: "#64c4ed", color: "#fff"}}>
                                        <Form method="POST" action="" onSubmit={(event) => this.handleSubmit(event)}>
                                            <div className="text-center" style={{
                                                backgroundColor: "#64c4ed",
                                                paddingTop: "10px",
                                                paddingBottom: "10px"
                                            }}>
                                                <CardTitle style={{marginTop: "20px"}}><h4>Registrati</h4></CardTitle>
                                            </div>
                                            <CardBody className="px-4 pb-4 pt-2">
                                                <InputGroup className="mb-3">
                                                    <span className="input-group-prepend" style={{width: "100%"}}>
                                                      <InputGroupText style={{
                                                          backgroundColor: "#fff",
                                                          color: "#64c4ed",
                                                          border: "0px"
                                                      }}>
                                                          <FontAwesomeIcon icon={faAt}/>
                                                      </InputGroupText>
                                                      <input type="email" name="email" autoFocus required
                                                             placeholder="Email" id="email"
                                                             style={{
                                                                 border: "0px",
                                                                 display: "block",
                                                                 width: "100%",
                                                                 height: "calc(1.5em + 0.75rem + 2px)",
                                                                 padding: "0.375rem 0.75rem",
                                                                 backgroundColor: "#fff",
                                                                 backgroundClip: "padding-box",
                                                                 borderTopRightRadius: "0.25rem",
                                                                 borderBottomRightRadius: "0.25rem",
                                                                 outline: "none"
                                                             }}
                                                      />
                                                    </span>
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <span className="input-group-prepend" style={{width: "100%"}}>
                                                      <InputGroupText style={{
                                                          backgroundColor: "#fff",
                                                          color: "#64c4ed",
                                                          border: "0px"
                                                      }}>
                                                          <FontAwesomeIcon icon={faUser}/>
                                                      </InputGroupText>
                                                      <input type="text" name="username" maxLength={20} required
                                                             placeholder="Username" id="username"
                                                             style={{
                                                                 border: "0px",
                                                                 display: "block",
                                                                 width: "100%",
                                                                 height: "calc(1.5em + 0.75rem + 2px)",
                                                                 padding: "0.375rem 0.75rem",
                                                                 backgroundColor: "#fff",
                                                                 backgroundClip: "padding-box",
                                                                 borderTopRightRadius: "0.25rem",
                                                                 borderBottomRightRadius: "0.25rem",
                                                                 outline: "none"
                                                             }}
                                                      />
                                                    </span>
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <span className="input-group-prepend" style={{width: "100%"}}>
                                                      <InputGroupText style={{
                                                          backgroundColor: "#fff",
                                                          color: "#64c4ed",
                                                          border: "0px"
                                                      }}>
                                                          <FontAwesomeIcon icon={faLock}/>
                                                      </InputGroupText>

                                                        <input type="password" name="password1" placeholder="Password"
                                                               id="password1" required
                                                               style={{
                                                                   border: "0px",
                                                                   display: "block",
                                                                   width: "100%",
                                                                   height: "calc(1.5em + 0.75rem + 2px)",
                                                                   padding: "0.375rem 0.75rem",
                                                                   backgroundColor: "#fff",
                                                                   backgroundClip: "padding-box",
                                                                   borderTopRightRadius: "0.25rem",
                                                                   borderBottomRightRadius: "0.25rem",
                                                                   outline: "none"
                                                               }}
                                                        />
                                                     </span>
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <span className="input-group-prepend" style={{width: "100%"}}>
                                                      <InputGroupText style={{
                                                          backgroundColor: "#fff",
                                                          color: "#64c4ed",
                                                          border: "0px"
                                                      }}>
                                                          <FontAwesomeIcon icon={faLock}/>
                                                      </InputGroupText>

                                                        <input type="password" name="password2" required
                                                               placeholder="Conferma password" id="password2"
                                                               style={{
                                                                   border: "0px",
                                                                   display: "block",
                                                                   width: "100%",
                                                                   height: "calc(1.5em + 0.75rem + 2px)",
                                                                   padding: "0.375rem 0.75rem",
                                                                   backgroundColor: "#fff",
                                                                   backgroundClip: "padding-box",
                                                                   borderTopRightRadius: "0.25rem",
                                                                   borderBottomRightRadius: "0.25rem",
                                                                   outline: "none"
                                                               }}
                                                        />
                                                    </span>
                                                </InputGroup>
                                                <div align={"center"}>
                                                    <Button type="submit" className="btn-light" style={{
                                                        color: "#17a2b8",
                                                        width: "110px"
                                                    }}>Registrati</Button>
                                                </div>
                                            </CardBody>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    }
                </div>
            )
    }
}

const mapsStateToProps = (state) =>{
    return {
        loading: state.loading,
        error: state.error,
        token: state.token,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        // onAuth: (email, username, password1, password2) => dispatch(actions.authSignup(email, username, password1, password2))
    }
};

export default connect(mapsStateToProps, mapDispatchToProps)(Signup);