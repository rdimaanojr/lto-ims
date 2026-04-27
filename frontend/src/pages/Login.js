export const Login = () => `
    <h1>LTO Infromation Management System</h1>

    <section>
        <h2>Login</h2>
        <form id="loginForm">
            <input type="text" id="loginUsername" placeholder="Username" required><br>
            <input type="password" id="loginPassword" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    </section>

    <hr>

    <section>
        <h2>Register</h2>
        <form id="registerForm">
            <input type="text" id="regUsername" placeholder="Username" required><br>
            <input type="password" id="regPassword" placeholder="Password" required><br>
            <input type="password" id="regConfirmPassword" placeholder="Confirm Password" required><br>
            <button type="submit">Register</button>
        </form>
    </section>
`;