import React from 'react';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

function LoginPage() {
    let history = useHistory();

    const formik = useFormik({
        initialValues: {
            name: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required'),
            password: Yup.string()
                .required('Required'),
        }),
        onSubmit: values => {
            localStorage.setItem('user', values);
            history.push("/");
        },
    });

    return (
        <div>
            <h4>LOGIN PAGE</h4>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                ) : null}
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div>{formik.errors.password}</div>
                ) : null}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export { LoginPage };