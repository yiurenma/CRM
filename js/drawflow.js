document.addEventListener("DOMContentLoaded", function() {
    const editor = new Drawflow(document.getElementById('drawflow'));
    editor.start();

    const pluginList = [];
    let selectedNodeId = null;
    let zoomLevel = 1;

    function fetchData() {
        showLoading();
        fetch('http://54.221.118.25:8080/api/workflow?applicationName=CHINA_CARE_MEDICAL_AI_EMAIL_2')
            .then(response => response.json())
            .then(data => {
                renderDrawflow(data);
                hideLoading();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                hideLoading();
            });
    }

    function renderDrawflow(data) {
        const nodes = data.pluginList.map(createNode);
        const connections = data.uiMapList.map(createConnection);

        editor.import({ drawflow: { Home: { data: nodes.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}) } } });

        connections.forEach(connection => editor.addConnection(connection.node, connection.node_in, connection.output, connection.input));
    }

    function createNode(plugin) {
        return {
            id: plugin.id,
            name: plugin.description || `节点 ${plugin.id}`,
            data: {
                description: plugin.description || '',
                inputRules: plugin.ruleList ? plugin.ruleList.map(rule => ({ rule: rule.key, description: rule.remark })) : [],
                outputAction: plugin.action ? {
                    type: plugin.action.type,
                    description: plugin.action.remark,
                    code: plugin.action.elseLogic,
                    httpMethod: plugin.action.httpRequestMethod,
                    httpUrl: plugin.action.httpRequestUrlWithQueryParameter,
                    httpHeaders: plugin.action.httpRequestHeaders,
                    httpRequestBody: plugin.action.httpRequestBody,
                    httpResponseBody: plugin.action.trackingNumberSchemaInHttpResponse
                } : {}
            },
            class: 'example-node',
            html: `<div>${plugin.description || `节点 ${plugin.id}`}</div>`,
            typenode: false,
            inputs: { input_1: { connections: [] } },
            outputs: { output_1: { connections: [] } },
            pos_x: parseInt(plugin.uiMap.position.x),
            pos_y: parseInt(plugin.uiMap.position.y)
        };
    }

    function createConnection(connection) {
        return {
            node: connection.source,
            output: 'output_1',
            input: 'input_1',
            node_in: connection.target
        };
    }

    function saveWorkflow() {
        showLoading();
        const data = editor.export();
        const nodes = Object.values(data.drawflow.Home.data).map(createNodePayload);
        const connections = Object.values(data.drawflow.Home.data).flatMap(createConnectionsPayload);

        const payload = { uiMapList: connections, pluginList: nodes };

        fetch('http://54.221.118.25:8080/api/workflow?applicationName=CHINA_CARE_MEDICAL_AI_EMAIL_2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Workflow saved:', data);
                showAlert('🎉 悄悄告诉您，您已经成功保存了！ 🎉');
                hideLoading();
            })
            .catch(error => {
                console.error('Error saving workflow:', error);
                hideLoading();
            });
    }

    function showAlert(message) {
        const alertPlaceholder = document.getElementById('alert-placeholder');
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertPlaceholder.appendChild(alert);
    }

    function showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

    function hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    function createNodePayload(node) {
        return {
            id: node.id,
            linkingIdOfRuleListAndAction: node.data.linkingIdOfRuleListAndAction,
            ruleList: node.data.inputRules.map(rule => ({ key: rule.rule, remark: rule.description })),
            action: {
                type: node.data.outputAction.type,
                remark: node.data.outputAction.description,
                elseLogic: node.data.outputAction.code,
                httpRequestMethod: node.data.outputAction.httpMethod,
                httpRequestUrlWithQueryParameter: node.data.outputAction.httpUrl,
                httpRequestHeaders:node.data.outputAction.httpHeaders,
                httpRequestBody: node.data.outputAction.httpRequestBody,
                trackingNumberSchemaInHttpResponse: node.data.outputAction.httpResponseBody
            },
            description: node.data.description,
            uiMap: {
                id: node.id,
                position: { x: node.pos_x.toString(), y: node.pos_y.toString() },
                data: { label: node.name }
            }
        };
    }

    function createConnectionsPayload(node) {
        const connection = node.outputs.output_1.connections[0];
        return {
            id: `e${node.id}-${connection ? connection.node : 'end'}`,
            source: node.id.toString(),
            target: connection ? connection.node.toString() : 'end'
        };
    }

    function addNode() {
        const nodeId = editor.addNode('示例节点', 1, 1, 200, 200, 'example-node', { "input_1": {}, "output_1": {} }, '<div>示例节点</div>');
        console.log('添加节点 ID:', nodeId);
    }

    function drag(event) {
        event.dataTransfer.setData("node", event.target.getAttribute('data-node'));
    }

    function drop(event) {
        event.preventDefault();
        const nodeName = event.dataTransfer.getData("node");
        const posX = event.clientX - event.target.getBoundingClientRect().left;
        const posY = event.clientY - event.target.getBoundingClientRect().top;
        editor.addNode(nodeName, 1, 1, posX, posY, nodeName, { "input_1": {}, "output_1": {} }, `<div>${nodeName}</div>`);
    }

    function addRule() {
        const ruleContainer = document.createElement('div');
        ruleContainer.className = 'input-group mb-2';
        ruleContainer.innerHTML = document.getElementById('rule-template').innerHTML;
        document.getElementById('node-input-rules').appendChild(ruleContainer);
    }

    function removeRule(event) {
        if (event.target.classList.contains('remove-rule')) event.target.parentElement.remove();
    }

    function saveNodeInfo() {
        const newName = document.getElementById('node-name').value;
        const newDescription = document.getElementById('node-description').value;
        const inputRules = Array.from(document.querySelectorAll('#node-input-rules .input-group')).map(group => ({
            rule: group.querySelector('.rule-input').value,
            description: group.querySelector('.description-input').value
        }));
        const outputAction = {
            type: document.getElementById('action-type').value,
            description: document.getElementById('action-description').value,
            code: document.getElementById('action-code').value,
            httpMethod: document.getElementById('http-method').value,
            httpUrl: document.getElementById('http-url').value,
            httpHeaders: document.getElementById('http-headers').value,
            httpRequestBody: document.getElementById('http-request-body').value,
            httpResponseBody: document.getElementById('http-response-body').value
        };
        const plugin = { id: selectedNodeId, name: newName, description: newDescription, inputRules, outputAction, uiMap: { id: selectedNodeId, position: { x: editor.getNodeFromId(selectedNodeId).pos_x.toString(), y: editor.getNodeFromId(selectedNodeId).pos_y.toString() } } };
        const existingPluginIndex = pluginList.findIndex(p => p.id === selectedNodeId);
        if (existingPluginIndex !== -1) pluginList[existingPluginIndex] = plugin;
        else pluginList.push(plugin);
        editor.updateNodeDataFromId(selectedNodeId, { name: newName, description: newDescription, inputRules, outputAction });
        const nodeHtml = `<div>${newName}<br>${newDescription}</div>`;
        document.querySelector(`#node-${selectedNodeId} .drawflow_content_node`).innerHTML = nodeHtml;
        console.log('pluginList:', pluginList);
    }

    function nodeSelected(id) {
        selectedNodeId = id;
        const node = editor.getNodeFromId(id);
        document.getElementById('node-name').value = node.name;
        document.getElementById('node-description').value = node.data.description || '';
        document.getElementById('node-input-rules').innerHTML = '';
        if (node.data.inputRules) {
            node.data.inputRules.forEach(rule => {
                const ruleContainer = document.createElement('div');
                ruleContainer.className = 'input-group mb-2';
                ruleContainer.innerHTML = document.getElementById('rule-template').innerHTML;
                ruleContainer.querySelector('.rule-input').value = rule.rule;
                ruleContainer.querySelector('.description-input').value = rule.description;
                document.getElementById('node-input-rules').appendChild(ruleContainer);
            });
        }
        document.getElementById('action-type').value = node.data.outputAction?.type || '';
        document.getElementById('action-description').value = node.data.outputAction?.description || '';
        document.getElementById('action-code').value = node.data.outputAction?.code || '';
        document.getElementById('http-method').value = node.data.outputAction?.httpMethod || '';
        document.getElementById('http-url').value = node.data.outputAction?.httpUrl || '';
        document.getElementById('http-headers').value = node.data.outputAction?.httpHeaders || '';
        document.getElementById('http-request-body').value = node.data.outputAction?.httpRequestBody || '';
        document.getElementById('http-response-body').value = node.data.outputAction?.httpResponseBody || '';
        document.getElementById('node-info').style.display = 'block';
    }

    function zoomIn() {
        zoomLevel += 0.1;
        editor.zoom_in();
    }

    function zoomOut() {
        zoomLevel -= 0.1;
        editor.zoom_out();
    }

    function zoomReset() {
        zoomLevel = 1;
        editor.zoom_reset();
    }

    document.getElementById('add-node').addEventListener('click', addNode);
    document.getElementById('save-workflow').addEventListener('click', saveWorkflow);
    document.getElementById('add-rule').addEventListener('click', addRule);
    document.getElementById('node-input-rules').addEventListener('click', removeRule);
    document.getElementById('save-node-info').addEventListener('click', saveNodeInfo);
    document.getElementById('drawflow').addEventListener('drop', drop);
    document.getElementById('drawflow').addEventListener('dragover', event => event.preventDefault());
    document.getElementById('zoom-in').addEventListener('click', zoomIn);
    document.getElementById('zoom-out').addEventListener('click', zoomOut);
    document.getElementById('zoom-reset').addEventListener('click', zoomReset);

    editor.on('nodeSelected', nodeSelected);

    fetchData();
    dragElement(document.getElementById('node-info'));
});

function dragElement(element) {
    const dragHandle = element.querySelector('.drag-handle');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    dragHandle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}