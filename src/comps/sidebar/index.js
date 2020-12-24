import React from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import { changeStdin, submitCode, checkResult } from '../../store/actions'

class Sidebar extends React.Component {
    handleStdin(e) {
        //not specific reason not to put in local state
        this.props.changeStdin(e.target.value)
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.submitCode(this.props.editor);
    }
    render() {
        let request = this.props.request;
        let disabled = (request.init && !request.completed) || this.props.editor.code.trim() === '';
        let output = null, status = null, stderr = null, comp_out = null;
        if (!request.init) {
            output = "Run the program to see its output"
        }
        else if (request.error) {
            output = "an error occured, see logs for more"
            status = 'Error'
        }
        else if (request.completed) {
            let result = request.output;
            status = result.status.description;
            stderr = result.stderr;
            output = result.stdout;
            comp_out = result.compile_output
        }
        else if (request.token) {
            output = "request queued, waiting for results..."
            if (request.output)
                status = request.output.status.description
            else
                status = "Queued"
        }
        else {
            output = "loading..."
        }
        return (
            <>
                <fieldset disabled={disabled}>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="w-100">
                        <Form.Group className="mb-1" controlId="stdin">
                            <Form.Label><strong className="text-white">Input (stdin)</strong></Form.Label>
                            <Form.Control onChange={this.handleStdin.bind(this)} name="stdin" as="textarea" rows="10" className="bg-dark border-secondary text-white" />
                        </Form.Group>
                        <Button className="ml-1" variant="danger" type="submit">Run</Button>
                    </Form>
                    {/* output */}
                    <Card className="mt-4" bg="dark" text="white">
                        <Card.Header><strong>Output</strong></Card.Header>
                        <Card.Body>
                            <Card.Text className="text-danger">{stderr}</Card.Text>
                            <Card.Text className="text-warning">{comp_out}</Card.Text>
                            <Card.Text className="text-monospace">{output}</Card.Text>
                            <Card.Footer className="font-italic text-info">{status}</Card.Footer>
                        </Card.Body>
                    </Card>
                </fieldset>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return state
}
export default connect(mapStateToProps, { changeStdin, submitCode, checkResult })(Sidebar)