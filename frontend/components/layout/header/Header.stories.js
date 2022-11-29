import Header from './index'

export default {
    title: 'Header',
    component: Header,
}

export const Story = (props) => <Header {...props}/>

Story.args = {
    show: true,
}