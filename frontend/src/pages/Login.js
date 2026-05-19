export const Login = () => {
    return `
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }    

            .login-full-page { 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                font-family: sans-serif;
                padding: 20px 0;
            }
            .login-wrapper {
                display: flex;
                flex-direction: column; 
                max-width: 450px;
                text-align: center;
                align-items: center;
                justify-content: center;
                flex-grow: 1;
            }
            .login-container { 
                padding: 40px; 
                border: 1px solid #888; 
                max-width: 350px; 
                border-radius: 8px; 
                text-align: center;
                width: 90%;z
            }
            h1 { width: 100%; font-size: 3em; margin-bottom: 30px; }
            h2 { font-size: 1em; margin-bottom: 15px; }
            .form-group { margin-bottom: 15px; text-align: left; }
            input { width: 100%; padding: 8px; box-sizing: border-box; }
            button { width: 100%; padding: 8px; cursor: pointer; margin-top: 10px; }
            .toggle-link { margin-top: 15px; font-size: 0.85em; color: #111; cursor: pointer; text-decoration: underline; }

            #login-footer {
                font-size: 0.8em; color: #555;
                flex-shrink: 0;
            }

        </style>

        <div class="login-full-page">
            <div class="login-wrapper">
                <h1>LTO Information Management System</h1>

                <div class="login-container">
                    <div id="view-login">
                        <h2>Login</h2>
                        <form id="loginForm">
                            <div class="form-group"><input type="text" id="loginUsername" placeholder="Username" required></div>
                            <div class="form-group"><input type="password" id="loginPassword" placeholder="Password" required></div>
                            <button type="submit">Login</button>
                        </form>
                        <div class="toggle-link" onclick="toggleAuth()">Need an account? Register</div>
                    </div>

                    <div id="view-register" style="display: none;">
                        <h2>Register</h2>
                        <form id="registerForm">
                            <div class="form-group"><input type="text" id="regUsername" placeholder="Username" required></div>
                            <div class="form-group"><input type="password" id="regPassword" placeholder="Password" required></div>
                            <div class="form-group"><input type="password" id="regConfirmPassword" placeholder="Confirm Password" required></div>
                            <button type="submit">Register</button>
                        </form>
                        <div class="toggle-link" onclick="toggleAuth()">Back to Login</div>
                    </div>
                </div>
            </div>
            <div id="login-footer">
                © 2026 Six Seven Technologies. All rights reserved.
            </div>
        </div>
    `;
};