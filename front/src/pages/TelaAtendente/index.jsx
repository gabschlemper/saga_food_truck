import { useState } from "react"
import "./style.css"

function TelaAtendente() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas")
  const [pedido, setPedido] = useState([])
  const [nomeCliente, setNomeCliente] = useState("")
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [quantidades, setQuantidades] = useState({})

  const handleLogout = () => {
    alert("Logout realizado!")
  }

  const produtos = [
    { id: 1, nome: "Hambúrguer Artesanal", preco: 18.5, categoria: "Lanches", estoque: 2 },
    { id: 2, nome: "Batata Frita", preco: 8.0, categoria: "Acompanhamentos", estoque: 0 },
    { id: 3, nome: "Refrigerante Lata", preco: 4.5, categoria: "Bebidas", estoque: 1 },
    { id: 4, nome: "Hot Dog Completo", preco: 12.0, categoria: "Lanches", estoque: 8 },
    { id: 5, nome: "Suco Natural", preco: 6.0, categoria: "Bebidas", estoque: 15 },
    { id: 6, nome: "Nuggets", preco: 10.0, categoria: "Lanches", estoque: 5 },
    { id: 7, nome: "Água Mineral", preco: 2.5, categoria: "Bebidas", estoque: 20 },
    { id: 8, nome: "Onion Rings", preco: 9.0, categoria: "Acompanhamentos", estoque: 3 },
  ]

  const categorias = ["Todas", "Lanches", "Acompanhamentos", "Bebidas"]

  const produtosFiltrados =
    categoriaAtiva === "Todas"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva)

  const alterarQuantidade = (id, tipo, estoque) => {
    setQuantidades((prev) => {
      const atual = prev[id] || 1
      let novaQtd = tipo === "aumentar" ? atual + 1 : atual - 1
      novaQtd = Math.max(1, Math.min(novaQtd, estoque))
      return { ...prev, [id]: novaQtd }
    })
  }

  const adicionarAoPedido = (produto) => {
    const quantidade = quantidades[produto.id] || 1
    const existente = pedido.find((item) => item.id === produto.id)
    let novoPedido
    if (existente) {
      novoPedido = pedido.map((item) =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      )
    } else {
      novoPedido = [...pedido, { ...produto, quantidade }]
    }
    setPedido(novoPedido)
    if (!carrinhoAberto) setCarrinhoAberto(true)
  }

  const removerDoPedido = (id) => {
    setPedido(pedido.filter((item) => item.id !== id))
  }

  const finalizarPedido = () => {
    if (pedido.length === 0) {
      alert("Nenhum item no pedido!")
      return
    }
    if (!nomeCliente.trim()) {
      alert("Digite o nome do cliente antes de finalizar.")
      return
    }

    alert(`✅ Pedido finalizado!\nCliente: ${nomeCliente}\nItens: ${pedido.length}\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`)
    setPedido([])
    setNomeCliente("")
    setCarrinhoAberto(false)
  }

  const total = pedido.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  )

  return (
    <div className="atendente-container">
      <div className="menu-principal">
        <div className="topo">
          <div className="titulo-saga">
            <h2 className="titulo-sistema">🛒SAGA Food Truck</h2>
            <p className="cargo-usuario">Logado como: <b>Atendente</b></p>
          </div>
        </div>

        <div className="categorias">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={categoriaAtiva === cat ? "ativo" : ""}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="produtos">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="produto-card">
              <h3>{produto.nome}</h3>
              <p className="preco">R$ {produto.preco.toFixed(2).replace(".", ",")}</p>
              <p className="categoria">{produto.categoria}</p>
              {produto.estoque === 0 ? (
                <span className="sem-estoque">Sem estoque</span>
              ) : (
                <span className="estoque">Estoque: {produto.estoque}</span>
              )}

              {produto.estoque > 0 && (
                <div className="quantidade-controle">
                  <button onClick={() => alterarQuantidade(produto.id, "diminuir", produto.estoque)}>–</button>
                  <span>{quantidades[produto.id] || 1}</span>
                  <button onClick={() => alterarQuantidade(produto.id, "aumentar", produto.estoque)}>+</button>
                </div>
              )}

              <button
                onClick={() => adicionarAoPedido(produto)}
                disabled={produto.estoque === 0}
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`pedido-lateral ${carrinhoAberto ? "aberto" : "fechado"}`}>
        <div className="toggle-carrinho" onClick={() => setCarrinhoAberto(!carrinhoAberto)}>
          {carrinhoAberto ? "⮜" : "⮞"}
        </div>

        {carrinhoAberto && (
          <div className="conteudo-carrinho">
            <h3>Pedido Atual</h3>
            <label>Nome do Cliente:</label>
            <input
              type="text"
              placeholder="Digite o nome..."
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
            />

            {pedido.length === 0 ? (
              <div className="pedido-vazio">
                <p>🛍️ Adicione produtos ao pedido</p>
              </div>
            ) : (
              <div className="pedido-lista">
                {pedido.map((item) => (
                  <div key={item.id} className="pedido-item">
                    <span>{item.nome}</span>
                    <span>x{item.quantidade}</span>
                    <span>
                      R$ {(item.preco * item.quantidade)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                    <button onClick={() => removerDoPedido(item.id)}>🗑️</button>
                  </div>
                ))}

                <div className="pedido-total">
                  <strong>Total: </strong>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>

                <button className="finalizar-btn" onClick={finalizarPedido}>
                  ✅ Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-link">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Sair</span>
        </button>
      </div>
    </div>
  )
}

export default TelaAtendente
