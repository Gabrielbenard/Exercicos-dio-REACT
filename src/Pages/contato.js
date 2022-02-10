 import { useState, useEffect } from 'react';
import { Grid, Button, TextField } from '@material-ui/core/';

const Contatos = () => {

    const url = 'http://localhost:5000/message'

    const [message, setMessage] = useState([]);

    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    const [validator, setValidator] = useState(false);
    const [render, setRender] = useState(false);
    const [success, setSuccess] = useState(false);


    // vai esperar a reposta do backend  e transformar no formado json 
    //e armazenar no data e depois tranformar o setmessage
    // e apenas se o render for true  
    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json();
        setMessage(data);
    }, [render])


    const sendMessage = () => {
        setValidator(false);
        // se o tamanho da string autor  ou do content(conteudo escrito abaixo do autor ) for menor ou igual a 0 
        // vai retornar set validator como true pois ja tinhamos declarados como false antes
        // se passar do if vai armazenar no objeto bodyform nas propriedades email e message.
        if(author.length <= 0 || content.length <= 0){
            return setValidator(!validator)
        }
        const bodyForm = {
            email: author,
            message: content,
        }
//1)escolhemos o tipo de método 
//2) definimos o tipo de messagem que é do tipo json
//3) definimos o body convertendo objeto Javascript para formato string em json
//  (bodyform é o objeto onde temos nosso conteudo )
// JSON.stringify vai transformar o conteudo   no formato json String 
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyForm)
        })
        // o .then vai realizar uma tarefa depois que o bloco acima for feito 
        .then((response) => response.json())
        // então faça para parametro o data , se  possuir a propriedade id do data que é um objeto
        //  seta o render como true e sucess como true e da um tempo de 5 segundos depois set o sucess como false para tirar a caixa de alerta
        .then((data) => {
            if(data.id) {
                setRender(true);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 5000)
            }
        })
  // depois de enviada deixará o espaço em braco       
        setAuthor('');
        setContent('');
        
        console.log(content)
    }  


 // se validator for true vai mostrar o alerta por favor preencha todos os campos 
 //se  sucess vai mostrar um alerta dizendo que a mensagem foi enviada     
    return(
        <>
            <Grid container direction="row" xs={12}>
                <TextField id="name" label="Name" value={author} onChange={(event)=>{setAuthor(event.target.value)}} fullWidth/>
                <TextField id="message" label="Message" value={content} onChange={(event)=>{setContent(event.target.value)}} fullWidth/>
            </Grid>

            {validator && 
                <div className="alert alert-warning alert-dismissible fade show mt-2" role="alert">
                    <strong>Por favor preencha todos os campos!</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            {success && 
                <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                    <strong>Mensagem foi enviada</strong>
                </div>
            }

            <Button onClick={sendMessage} className="mt-2" variant="contained" color="primary">
                Sent
            </Button>

            {message.map((content) => {
                return(
                    <div className="card mt-2" key={content.id}>
                        <div className="card-body">
                            <h5 className="card-title">{content.email}</h5>
                            <p className="card-text">{content.message}</p>
                            <p className="card-text"><small className="text-muted">{content.created_at}</small></p>
                        </div>
                    </div>
                )
            } )}
        </>
    )
}

export default Contatos;
