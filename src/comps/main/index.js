import React from 'react'
import { Nav, Dropdown, Button } from 'react-bootstrap'
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux'
import { changeCode, changeLang, submitCode } from '../../store/actions'
import languages from '../../api/languages.json'

class Main extends React.Component {
    state = {
        editorCode: '// type your code here...',
        editorTheme: 'dark',
        editorLang: languages[0].name
    }
    editor = React.createRef()
    changeLang(eventKey) {
        this.props.changeLang(eventKey);
        this.setState({
            editorLang: eventKey
        })
    }
    onEditorChange(newValue, e) {
        // console.log('onChange', newValue, e);
        this.props.changeCode(newValue)
    }
    toggleTheme() {
        this.setState({
            editorTheme: this.state.editorTheme === 'dark' ? 'light' : 'dark'
        })
    }
    updateDimensions() {
        //for resizing editor upon window resize
        if (this.editor.current)
            this.editor.current.editor.layout()
    }
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }
    editorDidMount(editor, monaco) {
        editor.focus();
        editor.addAction({
            id: 'COMMAND_RUN',
            label: 'Run code',
            keybindings: [
                monaco.KeyCode.F5,
            ],
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1,
            run: (ed) => {
                if (ed.getValue() === '') {
                    alert('Type some code to run')
                    return
                }
                let { submitCode, editor: editorState } = this.props;
                submitCode(editorState)
                return null;
            }
        })
    }
    render() {
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true,
            wordWrap: "on",
            fontSize: 20,
            minimap: {
                enabled: false
            }
        }
        let langs = languages.map(lang => lang.name)
        let lang = this.state.editorLang.split(' ')[0].toLowerCase();
        if (lang === "c++")
            lang = 'cpp'
        return (
            <>
                <Nav className="justify-content-between">
                    <Dropdown >
                        <Dropdown.Toggle variant="dark">{this.state.editorLang}</Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: "75vh", overflowY: "auto" }}>
                            {langs.map(lang => {
                                return (<Dropdown.Item
                                    key={lang}
                                    eventKey={lang}
                                    onSelect={this.changeLang.bind(this)}
                                    active={this.state.editorLang === lang}>
                                    {lang}</Dropdown.Item>)
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button
                        onClick={this.toggleTheme.bind(this)}
                        variant={'dark'} >
                        {this.state.editorTheme}</Button>
                </Nav>
                <MonacoEditor
                    className="border border-primary"
                    ref={this.editor}
                    height='90vh'
                    language={lang}
                    theme={`vs-${this.state.editorTheme}`}
                    value={code}
                    options={options}
                    onChange={this.onEditorChange.bind(this)}
                    editorDidMount={this.editorDidMount.bind(this)}
                />
                {/* Footer */}
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return state
}
export default connect(
    mapStateToProps,
    { changeCode, changeLang, submitCode }
)(Main)