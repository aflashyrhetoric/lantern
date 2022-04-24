import React, { useState } from "react"
import { Modal, Form, TextInput } from "carbon-components-react"

import { AuthType, LoginForm } from "../../types"
import { login, signup } from "./auth"

interface Props {
  baseurl: string
  showLogin: boolean
  authType: AuthType
  setAuthType: Function
  setShowLogin: Function
}

const LoginModal: React.FC<Props> = ({
  baseurl,
  showLogin,
  authType,
  setAuthType,
  setShowLogin,
}: Props) => {
  const [loginForm, setLoginForm] = useState<LoginForm>({} as LoginForm)
  const [invalidLogin, setInvalidLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <Modal
      open={showLogin}
      modalHeading={`Lantern: ${authType}`}
      primaryButtonText={authType}
      secondaryButtonText="Cancel"
      onBlur={() => setShowLogin(false)}
      onRequestClose={() => setShowLogin(false)}
      onRequestSubmit={() => {
        if (authType === AuthType.Login) {
          login(baseurl, loginForm)
            .then(() => {
              setLoading(false)
            })
            .catch(() => {
              setInvalidLogin(true)
            })
          return
        }
        if (authType === AuthType.Signup) {
          signup(baseurl, loginForm)
            .then(r => {
              setLoading(false)
              if (r.ok) {
                setAuthType(AuthType.Login)
              }
            })
            .catch(() => {
              setInvalidLogin(true)
            })
          return
        }
        return
      }}
    >
      <Form className="some-class" onSubmit={() => {}}>
        <TextInput
          id="email"
          name="email"
          type="email"
          value={(loginForm && loginForm.email) || ""}
          invalid={invalidLogin}
          invalidText="The username or password was not successful - try again."
          labelText="Email"
          onChange={e =>
            setLoginForm({
              ...loginForm,
              email: e.target.value,
            })
          }
        />
        <div style={{ marginBottom: "20px" }} />
        <TextInput
          id="password"
          name="password"
          type="password"
          value={(loginForm && loginForm.password) || ""}
          invalid={invalidLogin}
          invalidText="A valid value is required"
          labelText="Password"
          onChange={e =>
            setLoginForm({
              ...loginForm,
              password: e.target.value,
            })
          }
          onKeyUp={e => {
            if (e.key === "Enter") {
              if (authType === AuthType.Login) {
                login(baseurl, loginForm)
                return
              }
              if (authType === AuthType.Signup) {
                signup(baseurl, loginForm)
                return
              }
            }
          }}
        />
        <div style={{ marginBottom: "10px" }} />
        {
          <a
            style={{ cursor: "pointer" }}
            onClick={() =>
              setAuthType(
                authType === AuthType.Login ? AuthType.Signup : AuthType.Login,
              )
            }
          >
            Switch to {authType === AuthType.Login ? "Signup" : "Login"}
          </a>
        }
      </Form>
    </Modal>
  )
}

export default LoginModal
