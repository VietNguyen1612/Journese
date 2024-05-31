"use client";

import {
  Alert,
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  ChangeEventHandler,
  SyntheticEvent,
  useState,
} from "react";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";
import Link from "next/link";
import InputGroupText from "react-bootstrap/InputGroupText";

export default function Login() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [userLogin, setUserLogin] = useState<{
    phone: string;
    password: string;
  }>({ phone: "", password: "" });
  const [error, setError] = useState("");

  const getRedirect = () => {
    const redirect = getCookie("redirect");
    if (redirect) {
      deleteCookie("redirect");
      return redirect.toString();
    }
    return "/";
  };

  const login = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3056/api/v1/auth/user/signin`,
        {
          ...userLogin,
        }
      );
      if (res.status === 200) {
        // router.push(getRedirect());
        router.push(getRedirect());
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserLogin((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Alert
        variant="danger"
        show={error !== ""}
        onClose={() => setError("")}
        dismissible
      >
        {error}
      </Alert>
      <Form onSubmit={login}>
        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faUser} fixedWidth />
          </InputGroupText>
          <FormControl
            name="phone"
            required
            disabled={submitting}
            onChange={handleChange}
            placeholder="Username"
            aria-label="Username"
            value={userLogin.phone}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faLock} fixedWidth />
          </InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder="Password"
            onChange={handleChange}
            aria-label="Password"
            value={userLogin.password}
          />
        </InputGroup>

        <Row className="align-items-center">
          <Col xs={6}>
            <Button
              className="px-4"
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              Login
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Link className="px-0" href="#">
              Forgot password?
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}
