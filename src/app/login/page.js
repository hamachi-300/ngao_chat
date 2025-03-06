import "./loginpage.css";

export default function LoginPage() {

    const handleClick = (method) => {
        if (method === 'discord') {


        } else if (method === 'google') {

        }
    }

    return (
        <div className="layout">
            <div className="login">
                <div className="container">
                    <img id="logo" src="https://media.discordapp.net/attachments/1271539759763689502/1344379239285129236/E5962876-FCFC-461E-B1ED-194FE4D5D4E4.jpg?ex=67c943fc&is=67c7f27c&hm=de3cc8b6bf57f4c298b9f50ae826422792e179fd35cd4ea9a4520fd4cc4188ca&=&format=webp&width=412&height=412" />
                    <h1 id="logo-text">Ngao Ngao</h1>
                </div>
                <div className="all-buttons-div">
                    <div className="login-box google-div-box">
                        <button onClick={handleClick('google')} className="login-button google-button">Login with Google</button>
                    </div>
                    <div className="login-box discord-div-box">
                        <button onClick={handleClick('discord')} className="login-button discord-button">Login with Discord</button>
                    </div>
                </div>
            </div>
        </div>
    );
}