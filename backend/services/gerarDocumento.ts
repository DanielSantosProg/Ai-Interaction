import mssql from 'mssql'
import PDFDocument from 'pdfkit-table';
import fs from 'fs'
import path from 'path';
import { width } from 'pdfkit/js/page';

// Define a interface para o objeto de retorno da função
interface DocumentResult {
    success: boolean;
    path: string;
}

async function gerarDados(values: any, sqlPool: any){
    try {
        let data;
        let request = sqlPool.request();
        let stringFilters = "";

        if (values.modelo === "duplicatas") {
            if (values.dataInicio) {
                stringFilters += ` AND COR_DUP_DATA_VENCIMENTO >= CONVERT(DATETIME, @dataInicial, 120)`;
                request.input('dataInicial', mssql.VarChar(10), values.dataInicio);
            }
            if (values.dataFim) {
                stringFilters += ` AND COR_DUP_DATA_VENCIMENTO <= CONVERT(DATETIME, @dataFinal, 120)`;
                request.input('dataFinal', mssql.VarChar(10), values.dataFim);
            }
            if (values.empresa) {
                stringFilters += ` AND e.GER_EMP_ID = @empId`;
                request.input('empId', mssql.Int, values.empresa);
            }
            if (values.estabelecimento) {
                stringFilters += ` AND COR_DUP_ESTABELECIMENTO = @estabelecimentoId`;
                request.input('estabelecimentoId', mssql.Int, values.estabelecimento);
            }
            if (values.localizacao) {
                stringFilters += ` AND COR_DUP_LOCALIZACAO = @localizacaoId`;
                request.input('localizacaoId', mssql.Int, values.localizacao);
            }

            let result = await request.query(`
                SELECT [COR_DUP_DATA_EMISSAO] AS dataEmissao
                        ,[COR_DUP_VALOR_DUPLICATA] AS valorDuplicata
                        ,[COR_DUP_TIPO_FATURA] AS tipoFatura
                        ,[COR_DUP_DATA_VENCIMENTO] AS dataVencimento
                        ,[COR_DUP_DATA_PRORROGACAO] AS dataProrrogacao
                        ,[COR_DUP_DATA_CADASTRO] AS dataCadastro
                        ,[COR_DUP_LOCALIZACAO] AS idLocalizacao
                        ,l.COP_LOC_DESCRICAO AS localizacao
                        ,[COR_DUP_ESTABELECIMENTO] AS idEstabelecimento
                        ,est.COP_EST_DESCRICAO AS estabelecimento
                        ,[COR_DUP_DATA_BAIXA] AS dataBaixa
                        ,[COR_DUP_VALOR_BAIXA] AS valorBaixa
                        ,e.GER_EMP_NOME_FANTASIA AS nomeFantasia
                FROM COR_CADASTRO_DE_DUPLICATAS with(nolock) 
                INNER JOIN GER_EMPRESA e WITH (NOLOCK) ON e.GER_EMP_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_IDEMPRESA 
                INNER JOIN COP_LOCALIZACAO_CORE_E_COPA l WITH (NOLOCK) ON l.COP_LOC_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_LOCALIZACAO
                INNER JOIN COP_ESTABELECIMENTO est WITH (NOLOCK) ON est.COP_EST_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_ESTABELECIMENTO
                WHERE 1=1 ${stringFilters}
            `);

            console.log("Data: ", result.recordset);
            data = result.recordset;
        }

        if (values.modelo === "boletos") {
            if (values.dataInicio) {
                stringFilters += ` AND DATA_VENC >= CONVERT(DATETIME, @dataInicial, 120)`;
                request.input('dataInicial', mssql.VarChar(10), values.dataInicio);
            }
            if (values.dataFim) {
                stringFilters += ` AND DATA_VENC <= CONVERT(DATETIME, @dataFinal, 120)`;
                request.input('dataFinal', mssql.VarChar(10), values.dataFim);
            }
            if (values.empresa) {
                stringFilters += ` AND e.GER_EMP_ID = @empId`;
                request.input('empId', mssql.Int, values.empresa);
            }
            if (values.estabelecimento) {
                stringFilters += ` AND COR_DUP_ESTABELECIMENTO = @estabelecimentoId`;
                request.input('estabelecimentoId', mssql.Int, values.estabelecimento);
            }
            if (values.tipo == "Liquidados") {
                stringFilters += ` AND c.DATA_MOVIMENTO IS NOT NULL`;
            }

            let result = await request.query(`
                SELECT 
                    N_BOLETO AS numBoleto, DATA_VENC AS dataVencimento, DATA_PROCESS AS dataGeracao,
                    e.GER_EMP_NOME_FANTASIA AS nomeFantasia, est.COP_EST_DESCRICAO AS estabelecimento, VALOR AS valorBoleto, c.DATA_MOVIMENTO AS dataPagamento 
                FROM COR_BOLETO_BANCARIO c WITH(NOLOCK)
                INNER JOIN GER_EMPRESA e WITH(NOLOCK) ON c.IDEMPRESA = e.GER_EMP_ID
                INNER JOIN COR_CADASTRO_DE_DUPLICATAS d WITH(NOLOCK) ON c.ID_DUPLICATA = d.COR_DUP_ID
                INNER JOIN COP_ESTABELECIMENTO est WITH (NOLOCK) ON d.COR_DUP_ESTABELECIMENTO = est.COP_EST_ID
                WHERE 1=1 ${stringFilters}
            `);

            console.log("Data: ", result.recordset);
            data = result.recordset;
        }

        if (!data || data.length === 0) {
            throw new Error("Dados não encontrados.");
        }
        return data
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

async function gerarDocumento(values: any, sqlPool: any): Promise<DocumentResult> {
    try {
        const dados = await gerarDados(values, sqlPool);
        const dir = process.env.fileDirectory;
        
        // Cria o PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margins: { top: 20, bottom: 20, left: 20, right: 20 }
        });
        
        // Nome do arquivo
        const nomeArquivo = `${values.titulo}.pdf`;
        let filePath: fs.PathLike;
        if (dir) {
            filePath = path.join(dir, nomeArquivo);
        }

        let titulo: string;
        let tableData: any;

        if (values.modelo == "duplicatas") {
            titulo = "Relatório de Duplicatas";

            // Mapeia os dados para inserir na tabela do modelo 1
            tableData = dados.map((item: { nomeFantasia: any; dataEmissao: string | number | Date; valorDuplicata: number; tipoFatura: any; dataVencimento: string | number | Date; localizacao: any; estabelecimento: any; dataBaixa: string | number | Date; valorBaixa: number; }) => ({
                nomeFantasia: item.nomeFantasia,
                dataEmissao: new Date(item.dataEmissao).toLocaleDateString(),
                valorDuplicata: `R$ ${item.valorDuplicata.toFixed(2)}`,
                tipoFatura: item.tipoFatura,
                dataVencimento: item.dataVencimento ? new Date(item.dataVencimento).toLocaleDateString() : 'N/A',
                localizacao: item.localizacao,
                estabelecimento: item.estabelecimento,
                dataBaixa: item.dataBaixa ? new Date(item.dataBaixa).toLocaleDateString() : 'N/A',
                valorBaixa: item.valorBaixa ? `R$ ${item.valorBaixa.toFixed(2)}` : 'N/A',
            }));
        } else if (values.modelo == 'boletos') {
            titulo = "Relatório de Boletos";

            // Mapeia os dados para inserir na tabela do modelo 2
            tableData = dados.map((item: { numBoleto: number | string; nomeFantasia: string; dataVencimento: string | number | Date; dataGeracao: string | number | Date; valorBoleto: number; estabelecimento: any; dataPagamento: string | number | Date }) => ({
                numBoleto: item.numBoleto,
                nomeFantasia: item.nomeFantasia,
                estabelecimento: item.estabelecimento,
                dataVencimento: new Date(item.dataVencimento).toLocaleDateString(),
                dataGeracao: new Date(item.dataGeracao).toLocaleDateString(),
                valorBoleto: `R$ ${item.valorBoleto.toFixed(2)}`,
                dataPagamento: item.dataPagamento ? new Date(item.dataPagamento).toLocaleDateString() : 'Não Liquidado'
            }));
        }

        // Retorna uma Promise que resolve quando o arquivo estiver totalmente salvo
        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            doc.fontSize(20).text(titulo, { align: 'center' });
            doc.moveDown();  

            // Define a estrutura da tabela
            let table: any;
            if (values.modelo === "duplicatas"){
                table = {
                    headers: [
                        { label: "Empresa", property: 'nomeFantasia', width: 90 },
                        { label: "Emissão", property: 'dataEmissao', width: 60, align: 'center' },
                        { label: "Valor", property: 'valorDuplicata', width: 60, align: 'right' },
                        { label: "Tipo", property: 'tipoFatura', width: 40, align: 'center' },
                        { label: "Vencimento", property: 'dataVencimento', width: 60, align: 'center' },
                        { label: "Localização", property: 'localizacao', width: 90 },
                        { label: "Estabelecimento", property: 'estabelecimento', width: 90 },
                        { label: "Dt. Baixa", property: 'dataBaixa', width: 60, align: 'center' },
                        { label: "Vlr. Baixa", property: 'valorBaixa', width: 60, align: 'right' },
                    ],
                    datas: tableData,
                };
            } else if (values.modelo == "boletos") {                
                table = {
                    headers: [
                        { label: "Número", property: 'numBoleto', width: 60},
                        { label: "Empresa", property: 'nomeFantasia', width: 90 },
                        { label: "Estabelecimento", property: 'estabelecimento', width: 90 },
                        { label: "Vencimento", property: 'dataVencimento', width: 60, align: 'center' },
                        { label: "Emissão", property: 'dataGeracao', width: 60, align: 'center' },
                        { label: "Valor", property: 'valorBoleto', width: 60, align: 'right' },
                        { label: "Dt. Baixa", property: 'dataPagamento', width: 60, align: 'center' },
                    ],
                    datas: tableData,
                };
            }            

            // Gera a tabela
            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
                prepareRow: (row, i) => doc.font("Helvetica").fontSize(8)
            }).then(() => {
                doc.end();
            }).catch(reject);

            stream.on('finish', () => {
                console.log(`Relatório salvo como ${nomeArquivo}`);
                resolve({ success: true, path: String(filePath) });
            });

            stream.on('error', (err) => {
                console.error("Erro ao gerar o documento:", err);
                reject(err);
            });
        });

    } catch (error) {
        console.error("Erro ao gerar o documento:", error);
        throw error;
    }
}

export default gerarDocumento;