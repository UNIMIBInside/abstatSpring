package com.summarization.experiments;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.query.Syntax;

import java.util.concurrent.TimeUnit;

public class SparqlEndpoint{
	
	public static SparqlEndpoint local(){
		return new SparqlEndpoint("http://localhost");
	}
	
	public static SparqlEndpoint abstat(){
		return new SparqlEndpoint("http://abstat.disco.unimib.it");
	}
	
	public static SparqlEndpoint external(String host){
		return new SparqlEndpoint(host);
	}
	
	private String host;

	private SparqlEndpoint(String host){
		this.host = host;
	}
	
	public ResultSet execute(String query) {
		Query jenaQuery = QueryFactory.create(query, Syntax.syntaxARQ);
		QueryExecution sparqlService = QueryExecutionFactory.sparqlService(host + "/sparql", jenaQuery);
		sparqlService.setTimeout(180000, TimeUnit.MILLISECONDS);
                return sparqlService.execSelect();
	}
}
