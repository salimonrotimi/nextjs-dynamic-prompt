import {Toaster} from "react-hot-toast"; // install with npm, add the "Toaster" component and its properties
// <Toaster position="top-center" reverseOrder={false} gutter={8}/> after the {children} tag under the
// RootLayout()" function in app/layout.jsx file path.

// Beacause I want more customization, I am creating this "ToasterProvider()" function first before exporting
// it, which I will later import under the RootLayout()" function in app/layout.jsx file path.

function ToasterProvider(){
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // default option
                className: "",
                duration: 4000,
                style:{
                    background: "#363636",
                    color: "#fff",
                },
                // default option for "success"
                success:{
                    duration: 5000,
                    theme: {
                        primary: "green",
                        secondary: "green",
                    },
                },
                // default option for "error"
                error: {
                    duration: 5000,
                    theme: {
                        primary: "red",
                        secondary: "red",
                    }
                }
            }}
        />
    );
}

export default ToasterProvider